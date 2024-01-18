import { Pagination, Selection } from "@nextui-org/react";

interface TableBottomContentProps<T> {
    selectedKeys: Selection,
    filteredItems: T[],
    currentPage: number,
    rowCount: number,
    changePage: (page: number) => void,
    pageSize: number
}

export function TableBottomContent<T>(props: TableBottomContentProps<T>) {
  return (
    <div className="py-2 px-2 flex justify-between items-center">
      <span className="w-[30%] text-small text-default-400">
        {props.selectedKeys === "all"
          ? "Todos selecionados"
          : `${props.selectedKeys.size} de ${props.filteredItems.length} selecionados`}
      </span>
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={props.currentPage}
        total={Math.ceil(props.rowCount / props.pageSize)}
        onChange={props.changePage}
      />
      <div className="hidden sm:flex w-[30%] justify-end gap-2">
      </div>
    </div>
  );
}
