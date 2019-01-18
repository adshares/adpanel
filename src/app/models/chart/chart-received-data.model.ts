
// difference: 300
// differenceInPercentage: 0.06
// timestamps: Array(28)
// 0: "2018-12-01T16:58:14+00:00"
// 1: "2018-12-02T16:58:14+00:00"
// 2: "2018-12-03T16:58:14+00:00"
// 3: "2018-12-04T16:58:14+00:00"
// 4: "2018-12-05T16:58:14+00:00"
// 5: "2018-12-06T16:58:14+00:00"
// 6: "2018-12-07T16:58:14+00:00"
// 7: "2018-12-08T16:58:14+00:00"
// 8: "2018-12-09T16:58:14+00:00"
// 9: "2018-12-10T16:58:14+00:00"
// 10: "2018-12-11T16:58:14+00:00"
// 11: "2018-12-12T16:58:14+00:00"
// 12: "2018-12-13T16:58:14+00:00"
// 13: "2018-12-14T16:58:14+00:00"
// 14: "2018-12-15T16:58:14+00:00"
// 15: "2018-12-16T16:58:14+00:00"
// 16: "2018-12-17T16:58:14+00:00"
// 17: "2018-12-18T16:58:14+00:00"
// 18: "2018-12-19T16:58:14+00:00"
// 19: "2018-12-20T16:58:14+00:00"
// 20: "2018-12-21T16:58:14+00:00"
// 21: "2018-12-22T16:58:14+00:00"
// 22: "2018-12-23T16:58:14+00:00"
// 23: "2018-12-24T16:58:14+00:00"
// 24: "2018-12-25T16:58:14+00:00"
// 25: "2018-12-26T16:58:14+00:00"
// 26: "2018-12-27T16:58:14+00:00"
// 27: "2018-12-28T16:58:14+00:00"
// total: 5200
// values: (28) [96, 66, 82, 76, 73, 62, 78, 34, 38, 78, 65, 66, 85, 39, 93, 31, 60, 38, 87, 21, 76, 74, 72, 54, 35, 58, 96, 90

export interface ChartReceivedData {
  values: number[];
  timestamps: string[];
  difference?: number;
  differenceInPercentage?: number;
  total?: number;
}
