/**
 * NeuQuant Neural-Net Color Quantization Algorithm
 * Adapted for TypeScript. Reduces 24-bit/32-bit RGB pixels to 256 color palette.
 * Based on work by Anthony Dekker (1994).
 */

const ncycles = 100; // number of learning cycles
const netsize = 256; // number of color entries
const maxnetpos = netsize - 1;
const netbiasshift = 4; // bias for colour values
const intbiasshift = 16; // bias for fractions
const intbias = 1 << intbiasshift;
const gammashift = 10;
const betashift = 10;
const beta = intbias >> betashift; // beta = 1/1024
const betagamma = intbias << (gammashift - betashift);

// defs for freq
const initrad = netsize >> 3; // for 256 cols, radius starts at 32
const radiusbiasshift = 6;
const radiusbias = 1 << radiusbiasshift;
const initradius = initrad * radiusbias;
const radiusdec = 30; // factor of 1/30 each cycle

// defs for alpha
const alphabiasshift = 10; // alpha starts at 1
const initalpha = 1 << alphabiasshift;

// radbias and alpharadbias used for radpower calc
const radbiasshift = 8;
const radbias = 1 << radbiasshift;
const alpharadbshift = alphabiasshift + radbiasshift;
const alpharadbias = 1 << alpharadbshift;

export class NeuQuant {
  private network: Float64Array[]; // the network itself: [r, g, b] per node
  private netindex: Int32Array; // for fast lookup
  private bias: Float64Array; // bias and freq arrays for learning
  private freq: Float64Array;
  private radpower: Int32Array;
  private pixels: Uint8Array | Uint8ClampedArray;
  private samplefac: number;

  constructor(pixels: Uint8Array | Uint8ClampedArray, samplefac: number = 10) {
    this.pixels = pixels;
    this.samplefac = Math.max(1, Math.min(30, samplefac));

    this.network = [];
    this.netindex = new Int32Array(256);
    this.bias = new Float64Array(netsize);
    this.freq = new Float64Array(netsize);
    this.radpower = new Int32Array(initrad);

    for (let i = 0; i < netsize; i++) {
      this.network[i] = new Float64Array(4);
      // Initialize network evenly spread across gray values
      const val = (i << (netbiasshift + 8)) / netsize;
      this.network[i][0] = val;
      this.network[i][1] = val;
      this.network[i][2] = val;
      this.network[i][3] = i;
      this.freq[i] = intbias / netsize;
      this.bias[i] = 0;
    }
  }

  public init(): void {
    this.learn();
    this.unbiasnet();
    this.inxbuild();
  }

  // Returns 768-byte color map (R, G, B * 256)
  public getColorMap(): Uint8Array {
    const map = new Uint8Array(768);
    const index = new Int32Array(netsize);
    for (let i = 0; i < netsize; i++) {
      index[Math.round(this.network[i][3])] = i;
    }
    let k = 0;
    for (let l = 0; l < netsize; l++) {
      const j = index[l];
      map[k++] = Math.min(255, Math.max(0, Math.round(this.network[j][2]))); // R
      map[k++] = Math.min(255, Math.max(0, Math.round(this.network[j][1]))); // G
      map[k++] = Math.min(255, Math.max(0, Math.round(this.network[j][0]))); // B
    }
    return map;
  }

  // Search for 256-color palette index matching (r, g, b)
  public lookup(r: number, g: number, b: number): number {
    let bestd = 1000; // biggest possible dist is 256*3
    let best = -1;
    const iStart = Math.min(255, Math.max(0, Math.round(g)));
    let i = this.netindex[iStart]; // index on g
    let j = i - 1; // start at netindex[g] and work outwards

    while (i < netsize || j >= 0) {
      if (i < netsize) {
        const p = this.network[i];
        let dist = p[1] - g; // inverting dist
        if (dist >= bestd) {
          i = netsize; // stop iter
        } else {
          i++;
          if (dist < 0) dist = -dist;
          let a = p[2] - r; // R is index 2
          if (a < 0) a = -a;
          dist += a;
          if (dist < bestd) {
            a = p[0] - b; // B is index 0
            if (a < 0) a = -a;
            dist += a;
            if (dist < bestd) {
              bestd = dist;
              best = Math.round(p[3]);
            }
          }
        }
      }
      if (j >= 0) {
        const p = this.network[j];
        let dist = g - p[1]; // inverting dist
        if (dist >= bestd) {
          j = -1; // stop iter
        } else {
          j--;
          if (dist < 0) dist = -dist;
          let a = p[2] - r; // R is index 2
          if (a < 0) a = -a;
          dist += a;
          if (dist < bestd) {
            a = p[0] - b; // B is index 0
            if (a < 0) a = -a;
            dist += a;
            if (dist < bestd) {
              bestd = dist;
              best = Math.round(p[3]);
            }
          }
        }
      }
    }
    return best < 0 ? 0 : best;
  }

  private unbiasnet(): void {
    for (let i = 0; i < netsize; i++) {
      this.network[i][0] >>= netbiasshift;
      this.network[i][1] >>= netbiasshift;
      this.network[i][2] >>= netbiasshift;
      this.network[i][3] = i; // record color number
    }
  }

  private alterneigh(rad: number, i: number, b: number, g: number, r: number): void {
    const lo = Math.max(i - rad, 0);
    const hi = Math.min(i + rad, netsize);
    let j = i + 1;
    let k = i - 1;
    let m = 1;

    while (j < hi || k >= lo) {
      const a = this.radpower[m++];
      if (j < hi) {
        const p = this.network[j++];
        p[0] -= (a * (p[0] - b)) / alpharadbias;
        p[1] -= (a * (p[1] - g)) / alpharadbias;
        p[2] -= (a * (p[2] - r)) / alpharadbias;
      }
      if (k >= lo) {
        const p = this.network[k--];
        p[0] -= (a * (p[0] - b)) / alpharadbias;
        p[1] -= (a * (p[1] - g)) / alpharadbias;
        p[2] -= (a * (p[2] - r)) / alpharadbias;
      }
    }
  }

  private altersingle(alpha: number, i: number, b: number, g: number, r: number): void {
    const p = this.network[i];
    p[0] -= (alpha * (p[0] - b)) / initalpha;
    p[1] -= (alpha * (p[1] - g)) / initalpha;
    p[2] -= (alpha * (p[2] - r)) / initalpha;
  }

  private contest(b: number, g: number, r: number): number {
    let bestd = ~(1 << 31);
    let bestbiasd = bestd;
    let bestpos = -1;
    let bestbiaspos = bestpos;

    for (let i = 0; i < netsize; i++) {
      const p = this.network[i];
      let dist = p[0] - b;
      if (dist < 0) dist = -dist;
      let a = p[1] - g;
      if (a < 0) a = -a;
      dist += a;
      a = p[2] - r;
      if (a < 0) a = -a;
      dist += a;

      if (dist < bestd) {
        bestd = dist;
        bestpos = i;
      }
      const biasdist = dist - (this.bias[i] >> (intbiasshift - netbiasshift));
      if (biasdist < bestbiasd) {
        bestbiasd = biasdist;
        bestbiaspos = i;
      }
      const betafreq = this.freq[i] >> betashift;
      this.freq[i] -= betafreq;
      this.bias[i] += betafreq << gammashift;
    }
    this.freq[bestpos] += beta;
    this.bias[bestpos] -= betagamma;
    return bestbiaspos;
  }

  private inxbuild(): void {
    let previouscol = 0;
    let startpos = 0;

    for (let i = 0; i < netsize; i++) {
      const p = this.network[i];
      let smallpos = i;
      let smallval = p[1]; // index on g
      for (let j = i + 1; j < netsize; j++) {
        const q = this.network[j];
        if (q[1] < smallval) {
          smallpos = j;
          smallval = q[1];
        }
      }
      const q = this.network[smallpos];
      if (i !== smallpos) {
        let x = p[0];
        p[0] = q[0];
        q[0] = x;
        x = p[1];
        p[1] = q[1];
        q[1] = x;
        x = p[2];
        p[2] = q[2];
        q[2] = x;
        x = p[3];
        p[3] = q[3];
        q[3] = x;
      }
      if (smallval !== previouscol) {
        this.netindex[previouscol] = (startpos + i) >> 1;
        for (let j = previouscol + 1; j < smallval; j++) {
          this.netindex[j] = i;
        }
        previouscol = smallval;
        startpos = i;
      }
    }
    this.netindex[previouscol] = (startpos + maxnetpos) >> 1;
    for (let j = previouscol + 1; j < 256; j++) {
      this.netindex[j] = maxnetpos;
    }
  }

  private learn(): void {
    const lengthcount = this.pixels.length;
    const alphadec = 30 + (this.samplefac - 1) / 3;
    const samplepixels = lengthcount / (4 * this.samplefac);
    let delta = Math.floor(samplepixels / ncycles);
    if (delta === 0) delta = 1;
    let alpha = initalpha;
    let radius = initradius;

    let rad = radius >> radiusbiasshift;
    if (rad <= 1) rad = 0;
    for (let i = 0; i < rad; i++) {
      this.radpower[i] = Math.floor(alpha * (((rad * rad - i * i) * radbias) / (rad * rad)));
    }

    let step: number;
    if (lengthcount < 500 * 4) {
      this.samplefac = 1;
      step = 4;
    } else if (lengthcount % 499 !== 0) {
      step = 499 * 4;
    } else if (lengthcount % 491 !== 0) {
      step = 491 * 4;
    } else if (lengthcount % 487 !== 0) {
      step = 487 * 4;
    } else {
      step = 503 * 4;
    }

    let i = 0;
    let pix = 0;

    while (i < samplepixels) {
      const r = (this.pixels[pix + 0] & 0xff) << netbiasshift;
      const g = (this.pixels[pix + 1] & 0xff) << netbiasshift;
      const b = (this.pixels[pix + 2] & 0xff) << netbiasshift;
      const j = this.contest(b, g, r);

      this.altersingle(alpha, j, b, g, r);
      if (rad !== 0) this.alterneigh(rad, j, b, g, r);

      pix += step;
      if (pix >= lengthcount) pix -= lengthcount;

      i++;
      if (delta === 0) delta = 1;
      if (i % delta === 0) {
        alpha -= alpha / alphadec;
        radius -= radius / radiusdec;
        rad = radius >> radiusbiasshift;
        if (rad <= 1) rad = 0;
        for (let k = 0; k < rad; k++) {
          this.radpower[k] = Math.floor(alpha * (((rad * rad - k * k) * radbias) / (rad * rad)));
        }
      }
    }
  }
}
