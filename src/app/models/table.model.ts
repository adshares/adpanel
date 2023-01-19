interface TableColumnMetaData {
  title?: string;
  columnWidth: string;

  keys?: string[];
  defaultDesc?: boolean;
  sortedDesc?: boolean;
  isSortedBy?: boolean;
  hideArrows?: boolean;
}

interface TableSortEvent {
  keys: string[];
  sortDesc: boolean;
}

export { TableColumnMetaData, TableSortEvent };
