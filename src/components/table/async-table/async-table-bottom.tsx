import { Pagination, Selection } from "@nextui-org/react";
import { useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks";

interface TableBottomContentProps<T> {
  selectedKeys: Selection,
  filteredItems: T[],
  paging: Pagination,
  fetchData: (pagination: PagedRequest) => PagedResponse<T>,
}

export function TableBottomContent<T>(props: TableBottomContentProps<T>) {
  const dispatch = useAppDispatch()

  const handlePageChange = (pageNumber: number) => {
    const p = { currentPage: pageNumber, pageSize: props.paging.pageSize, sort: ""} as PagedRequest;
    dispatch(props.fetchData(p));
  }

  useEffect(() => {
    handlePageChange(1);
  }, [props.paging.pageSize, props.paging.currentPage, props.paging.pageCount]);

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
        page={props.paging.currentPage}
        total={props.paging.pageCount}
        onChange={(p) => { handlePageChange(p) }}
      />
      <div className="hidden sm:flex w-[30%] justify-end gap-2">
      </div>
    </div>
  );
}
