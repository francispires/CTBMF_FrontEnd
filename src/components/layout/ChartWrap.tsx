interface ChartWrapperProps {
    children: React.ReactNode;
    title?: string;
}
export const ChartWrap = ({children, title}: ChartWrapperProps) => {
    return (
        <>
            <div id="chart">
                <div className="flex gap-2.5 justify-center">
                    <div className="flex flex-col  py-2 px-6 rounded-xl">
                        <span className="text-default-900 text-xl font-semibold">
                          {title}
                        </span>
                    </div>
                </div>
                {children}
            </div>
        </>
    );
};