import {Avatar} from "@nextui-org/react";

export const UserCard = () => {
    return (
        <>
            <div hidden={true} className="grid grid-cols-2 gap-1">
                <div className=""><Avatar
                    isBordered
                    color="secondary"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026024d"/>
                </div>
                <div className=""><span className="text-success text-xl float-end">1985 pontos</span>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <div className="">
                    <h2 className="font-bold text-2xl tracking-wide">Francis Pires</h2>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
                <h2 className="font-bold text-medium tracking-wide">Melhor:</h2>
                <span className="font-bold text-sm text-success tracking-wide">Matemática</span>
                <h2 className="font-bold text-medium tracking-wide">Pior:</h2>
                <span className="font-bold text-sm text-danger tracking-wide">Portugês</span>
                <h2 className="font-bold text-medium tracking-wide">Respostas:</h2>
                <span className="font-bold text-sm text-success tracking-wide">123</span>
            </div>
        </>
    );
};
