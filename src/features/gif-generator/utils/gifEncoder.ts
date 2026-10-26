import { NeuQuant } from './NeuQuant';

export interface GifFrameInput {
  imageData: ImageData;
  delayMs: number;
}

export interface GifEncodeOptions {
  width: number;
  height: number;
  frames: GifFrameInput[];
  loopCount?: number; // 0 for infinite loop
  quality?: number; // 1 to 30 (default 10)
  dither?: boolean;
  onProgress?: (current: number, total: number) => void;
  signal?: AbortSignal;
}

/**
 * Lightweight byte buffer helper for building GIF89a binary streams.
 */
class ByteArray {
  private buffer: Uint8Array;
  private capacity: number;
  public length: number;

  constructor(initialCapacity = 65536) {
    this.capacity = initialCapacity;
    this.buffer = new Uint8Array(this.capacity);
    this.length = 0;
  }

  public writeByte(b: number): void {
    if (this.length >= this.capacity) {
      this.grow();
    }
    this.buffer[this.length++] = b & 0xff;
  }

  public writeShort(v: number): void {
    this.writeByte(v & 0xff);
    this.writeByte((v >> 8) & 0xff);
  }

  public writeBytes(bytes: ArrayLike<number>): void {
    for (let i = 0; i < bytes.length; i++) {
      this.writeByte(bytes[i]);
    }
  }

  public writeString(str: string): void {
    for (let i = 0; i < str.length; i++) {
      this.writeByte(str.charCodeAt(i));
    }
  }

  public toUint8Array(): Uint8Array {
    return this.buffer.subarray(0, this.length);
  }

  private grow(): void {
    this.capacity = Math.max(this.capacity * 2, this.capacity + 65536);
    const next = new Uint8Array(this.capacity);
    next.set(this.buffer);
    this.buffer = next;
  }
}

/**
 * LZW Image Data Compressor for GIF specification
 */
class LzwCompressor {
  private width: number;
  private height: number;
  private pixels: Uint8Array;
  private initCodeSize: number;
  private curAccum = 0;
  private curBits = 0;
  private accum = new Uint8Array(256);
  private aCount = 0;
  private freeEnt = 0;
  private maxcode = 0;
  private clearFlag = false;
  private gInitBits = 0;
  private ClearCode = 0;
  private EOFCode = 0;
  private nBits = 0;
  private hshift = 0;
  private htab = new Int32Array(5003);
  private codetab = new Int32Array(5003);

  constructor(width: number, height: number, pixels: Uint8Array, colorDepth: number) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
    this.initCodeSize = Math.max(2, colorDepth);
  }

  public encode(out: ByteArray): void {
    out.writeByte(this.initCodeSize);

    this.nBits = this.gInitBits = this.initCodeSize + 1;
    this.clearFlag = false;
    this.maxcode = (1 << this.nBits) - 1;
    this.ClearCode = 1 << (this.gInitBits - 1);
    this.EOFCode = this.ClearCode + 1;
    this.freeEnt = this.ClearCode + 2;
    this.aCount = 0;

    const hsize = 5003;
    for (let i = 0; i < hsize; i++) {
      this.htab[i] = -1;
    }

    this.hshift = 0;
    for (let f = hsize; f < 65536; f *= 2) {
      this.hshift++;
    }
    this.hshift = 8 - this.hshift;

    this.output(this.ClearCode, out);

    let curPixel = 0;
    const totalPixels = this.width * this.height;

    let ent = this.pixels[curPixel++];

    while (curPixel < totalPixels) {
      const c = this.pixels[curPixel++];
      const fcode = (c << 12) + ent;
      let i = (c << this.hshift) ^ ent;

      if (this.htab[i] === fcode) {
        ent = this.codetab[i];
        continue;
      } else if (this.htab[i] >= 0) {
        let disp = hsize - i;
        if (i === 0) disp = 1;
        let found = false;
        do {
          i -= disp;
          if (i < 0) i += hsize;
          if (this.htab[i] === fcode) {
            ent = this.codetab[i];
            found = true;
            break;
          }
        } while (this.htab[i] >= 0);
        if (found) continue;
      }

      this.output(ent, out);
      ent = c;
      if (this.freeEnt < 4096) {
        this.codetab[i] = this.freeEnt++;
        this.htab[i] = fcode;
      } else {
        this.clearBlock(out);
      }
    }

    this.output(ent, out);
    this.output(this.EOFCode, out);
    this.flush(out);

    out.writeByte(0); // Sub-block terminator
  }

  private clearBlock(out: ByteArray): void {
    for (let i = 0; i < 5003; i++) {
      this.htab[i] = -1;
    }
    this.freeEnt = this.ClearCode + 2;
    this.clearFlag = true;
    this.output(this.ClearCode, out);
  }

  private output(code: number, out: ByteArray): void {
    this.curAccum |= code << this.curBits;
    this.curBits += this.nBits;

    while (this.curBits >= 8) {
      this.charOut(this.curAccum & 0xff, out);
      this.curAccum >>= 8;
      this.curBits -= 8;
    }

    if (this.freeEnt > this.maxcode || this.clearFlag) {
      if (this.clearFlag) {
        this.maxcode = (1 << (this.nBits = this.gInitBits)) - 1;
        this.clearFlag = false;
      } else {
        this.nBits++;
        if (this.nBits === 12) {
          this.maxcode = 4096;
        } else {
          this.maxcode = (1 << this.nBits) - 1;
        }
      }
    }

    if (code === this.EOFCode) {
      while (this.curBits > 0) {
        this.charOut(this.curAccum & 0xff, out);
        this.curAccum >>= 8;
        this.curBits -= 8;
      }
      this.flush(out);
    }
  }

  private charOut(c: number, out: ByteArray): void {
    this.accum[this.aCount++] = c;
    if (this.aCount >= 254) {
      this.flush(out);
    }
  }

  private flush(out: ByteArray): void {
    if (this.aCount > 0) {
      out.writeByte(this.aCount);
      for (let i = 0; i < this.aCount; i++) {
        out.writeByte(this.accum[i]);
      }
      this.aCount = 0;
    }
  }
}

/**
 * Asynchronously encodes an array of frames into a genuine animated GIF Blob
 */
export async function encodeGifAsync(options: GifEncodeOptions): Promise<Blob> {
  const {
    width,
    height,
    frames,
    loopCount = 0,
    quality = 10,
    dither = false,
    onProgress,
    signal,
  } = options;

  if (frames.length === 0) {
    throw new Error('Cannot encode GIF: frames array is empty.');
  }

  const out = new ByteArray(width * height * frames.length + 4096);

  // 1. GIF89a Header
  out.writeString('GIF89a');

  // 2. Logical Screen Descriptor
  out.writeShort(width);
  out.writeShort(height);
  // Packed field: Global Color Table Flag = 0 (we use Local Color Tables for crisp per-frame palettes)
  out.writeByte(0x70);
  out.writeByte(0x00); // Background Color Index
  out.writeByte(0x00); // Pixel Aspect Ratio

  // 3. Netscape 2.0 Application Extension (for looping)
  out.writeByte(0x21); // Extension Introducer
  out.writeByte(0xff); // Application Extension Label
  out.writeByte(0x0b); // Block size (11 bytes)
  out.writeString('NETSCAPE2.0');
  out.writeByte(0x03); // Sub-block size (3 bytes)
  out.writeByte(0x01); // Sub-block ID
  out.writeShort(loopCount); // Loop count (0 = infinite)
  out.writeByte(0x00); // Block terminator

  const totalFrames = frames.length;

  for (let fIndex = 0; fIndex < totalFrames; fIndex++) {
    if (signal?.aborted) {
      throw new Error('GIF generation cancelled by user.');
    }

    const frame = frames[fIndex];
    const { imageData, delayMs } = frame;
    const rawRgba = imageData.data;
    const numPixels = width * height;

    // Report progress
    if (onProgress) {
      onProgress(fIndex + 1, totalFrames);
    }

    // Yield to the event loop so browser UI does not freeze
    await new Promise((resolve) => setTimeout(resolve, 0));

    // A. Color Quantization via NeuQuant
    const nq = new NeuQuant(rawRgba, quality);
    nq.init();
    const colorMap = nq.getColorMap(); // 768 bytes (256 * 3)

    // B. Map pixels to 256 palette indices (with optional Floyd-Steinberg dithering)
    const indexedPixels = new Uint8Array(numPixels);

    if (dither) {
      // Floyd-Steinberg Dithering
      const rErr = new Float32Array(numPixels);
      const gErr = new Float32Array(numPixels);
      const bErr = new Float32Array(numPixels);

      let pIdx = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const rgbaIdx = pIdx * 4;
          const r = Math.min(255, Math.max(0, rawRgba[rgbaIdx + 0] + rErr[pIdx]));
          const g = Math.min(255, Math.max(0, rawRgba[rgbaIdx + 1] + gErr[pIdx]));
          const b = Math.min(255, Math.max(0, rawRgba[rgbaIdx + 2] + bErr[pIdx]));

          const idx = nq.lookup(r, g, b);
          indexedPixels[pIdx] = idx;

          const qr = colorMap[idx * 3 + 0];
          const qg = colorMap[idx * 3 + 1];
          const qb = colorMap[idx * 3 + 2];

          const er = r - qr;
          const eg = g - qg;
          const eb = b - qb;

          if (x + 1 < width) {
            const nextIdx = pIdx + 1;
            rErr[nextIdx] += (er * 7) / 16;
            gErr[nextIdx] += (eg * 7) / 16;
            bErr[nextIdx] += (eb * 7) / 16;
          }
          if (y + 1 < height) {
            if (x > 0) {
              const blIdx = pIdx + width - 1;
              rErr[blIdx] += (er * 3) / 16;
              gErr[blIdx] += (eg * 3) / 16;
              bErr[blIdx] += (eb * 3) / 16;
            }
            const bIdx = pIdx + width;
            rErr[bIdx] += (er * 5) / 16;
            gErr[bIdx] += (eg * 5) / 16;
            bErr[bIdx] += (eb * 5) / 16;
            if (x + 1 < width) {
              const brIdx = pIdx + width + 1;
              rErr[brIdx] += (er * 1) / 16;
              gErr[brIdx] += (eg * 1) / 16;
              bErr[brIdx] += (eb * 1) / 16;
            }
          }

          pIdx++;
        }
      }
    } else {
      // Direct nearest-neighbor palette lookup (faster)
      let pIdx = 0;
      for (let i = 0; i < rawRgba.length; i += 4) {
        const r = rawRgba[i];
        const g = rawRgba[i + 1];
        const b = rawRgba[i + 2];
        indexedPixels[pIdx++] = nq.lookup(r, g, b);
      }
    }

    // C. Graphic Control Extension (8 bytes)
    out.writeByte(0x21); // Extension Introducer
    out.writeByte(0xf9); // Graphic Control Label
    out.writeByte(0x04); // Block size (4 bytes)

    // Disposal method: 2 (restore to background), no user input, no transparency
    out.writeByte(0x08);

    // Frame Delay in centiseconds (1/100s). Minimum 2cs (20ms) to prevent slow browser fallback
    const centiseconds = Math.max(2, Math.round(delayMs / 10));
    out.writeShort(centiseconds);

    out.writeByte(0x00); // Transparent color index
    out.writeByte(0x00); // Block terminator

    // D. Image Descriptor (10 bytes)
    out.writeByte(0x2c); // Image Separator
    out.writeShort(0); // Image Left
    out.writeShort(0); // Image Top
    out.writeShort(width); // Image Width
    out.writeShort(height); // Image Height

    // Packed: Local Color Table Present (0x80), Not Interlaced (0x00), Size 256 (0x07)
    out.writeByte(0x87);

    // E. Local Color Table (768 bytes)
    out.writeBytes(colorMap);

    // F. LZW Compressed Image Data
    const lzw = new LzwCompressor(width, height, indexedPixels, 8);
    lzw.encode(out);
  }

  // 4. GIF Trailer
  out.writeByte(0x3b);

  const finalBytes = out.toUint8Array();
  return new Blob([finalBytes as unknown as BlobPart], { type: 'image/gif' });
}
