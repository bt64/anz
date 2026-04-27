import { read } from "mat-for-js";

type FileData = {
  ch_number: number[];
  evoked_flag: number[];
  record_points: number[];
  record_values: number[][];
  sampling_rate: number[];
};

const interpolationDegree = 4;

export class Data {
  /**
   * @param data The voltage values of the signal.
   * @param sampleRate The sampling rate of the signal in Hz.
   */
  constructor(
    public data: number[],
    public samplingRate: number,
    public isEvoked = false,
    public frame = 0,
  ) {}

  static async fromFile(file: File): Promise<Data> {
    const buf = await file.arrayBuffer();
    const matData = read<FileData>(buf);
    console.log(matData);

    const chNumber = matData.data.ch_number[0];
    const isEvoked = matData.data.evoked_flag[0] === 1;
    // const chNumber = 2;
    const channels = matData.data.ch_number;
    const samplingRate = matData.data.sampling_rate[0];
    const recordValues = matData.data.record_values[chNumber];
    const evokedValues: number[] = matData.data.record_values[0].flat();

    const data = new Data(
      isEvoked ? evokedValues : recordValues,
      samplingRate,
      isEvoked,
    );

    document.querySelector("p.info")!.innerHTML =
      `<span>${file.name}</span> : ${samplingRate}Hz, ${data.duration}s, [${data.min.toFixed(3)}V, ${data.max.toFixed(3)}V], CH${channels.join("/CH")}`;

    return data;
  }

  public get duration() {
    return this.data.length / this.samplingRate;
  }

  public get min() {
    return Math.min(...this.data);
  }

  public get max() {
    return Math.max(...this.data);
  }

  public get absMax() {
    return Math.max(Math.abs(this.min), Math.abs(this.max));
  }

  public get interpolated() {
    if (this.isEvoked) return this.data;
    const interpolated: number[] = [];

    let a = 0;
    let n = 0;

    for (const point of this.data) {
      a += point;
      n++;
      if (n === interpolationDegree) {
        interpolated.push(a / n);

        a = 0;
        n = 0;
      }
    }

    return interpolated;
  }

  public points(interpolated = false) {
    const points: { x: number; y: number }[] = [];
    const data = interpolated ? this.interpolated : this.data;

    for (let i = 0; i < data.length; i++) {
      const x = interpolated ? i * interpolationDegree : i;
      const y = data[i];
      points.push({ x, y });
    }

    return points;
  }
}
