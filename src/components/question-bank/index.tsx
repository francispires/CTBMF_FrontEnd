
export const QuestionBank = () => {
    return (
        <div className="my-5 max-w-[99rem] mx-auto w-full flex flex-col gap-10">
            <h1>Question Bank</h1>
            <div>
                <h3>Filtros</h3>
                <div>
                    <label htmlFor="institution">Instituição</label>
                    <select name="institution" id="institution">
                        <option value="1">CTBMF</option>
                        <option value="2">CTBMF</option>
                        <option value="3">CTBMF</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
