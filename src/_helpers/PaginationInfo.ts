class PaginationInfo {
    public IncludeTotals: boolean;
    public PerPage: number;
    public PageNo: number;
  constructor() {
    this.IncludeTotals = false;
    this.PerPage = 50;
    this.PageNo = 1;
  }
}