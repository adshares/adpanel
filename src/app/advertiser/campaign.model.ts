export class Campaign {
  constructor(
    public status: string;
    public name: string;
    public budgetPerDay: number;
    public clicks: number;
    public impressions: number;
    public ctr: number;
    public averageCpc: number;
    public totalCost: number;
  ) {}
}
