import { Community } from "../icons/community";

export const CardBalance2 = () => {
  return (
<div>
  <div className="flex gap-2.5">
    <Community />
    <div className="flex flex-col">
      <span className="text-default-900">Aproveitamento Semanal</span>
      <span className="text-default-900 text-xs">+2400 Pontos</span>
    </div>
  </div>
  <div className="flex gap-2.5 py-2 items-center">
          <span className="text-default-900 text-xl font-semibold">
            404  <span className="text-default-900 text-xs">Pontos</span>
          </span>
    <span className="text-success text-xs">+ 4.5%</span>
  </div>
  <div className="flex items-center gap-6">
    <div>
      <div>
              <span className="font-semibold text-success-600 text-xs">
                {"↑"}
              </span>
        <span className="text-xs">200</span>
      </div>
      <span className="text-default-900 text-xs">Questões Abertas</span>
    </div>

    <div>
      <div>
        <span className="font-semibold text-danger text-xs">{"↑"}</span>
        <span className="text-xs">54</span>
      </div>
      <span className="text-default-900 text-xs">Quizes</span>
    </div>

    <div>
      <div>
        <span className="font-semibold text-danger text-xs">{"⭐"}</span>
        <span className="text-xs">150</span>
      </div>
      <span className="text-default-900 text-xs">Especiais</span>
    </div>
  </div></div>
  );
};
