import {Button, Image, Link} from "@nextui-org/react";

export const PublicPage = () => {
    return (
        <div className="min-h-[calc(100vh)] grid sm:grid-cols-1 md:grid-cols-2 2xl:grid-cols-2"
             style={{
                 background: "url(/img/fundo_home.png)",
                 backgroundSize: "cover",
                 backgroundRepeat: "repeat-y",
             }}>

            <div className={"p-10"}>
                <h1 className={"text-white xl:text-6xl xl:leading-60 md:text-4xl md:leading-40 font-bold"}>VOCÊ ESTÁ A UM PASSO
                    DE&nbsp;
                    <span className={"font-extrabold text-red-600"}>ALCANÇAR A SUA APROVAÇÃO&nbsp;
                        <span className={"text-white"}>EM BUCOMAXILO!</span>
                    </span>
                </h1>
                <p className={"my-8 text-white"}>Descubra o método que tem ajudado alunos de odontologia, recém formados e
                    cirurgiões
                    dentistas a
                    serem aprovados nas provas de residência por todo Brasil.</p>
                <Button href={"/dashboard"} className={"bg-red-600 px-10 py-2"}>
                    <Link className={"text-white"} href={"/dashboard"}>INICIAR MEUS ESTUDOS</Link>
                </Button>
            </div>
            <div className={"p-10 flex content-center"}>
                <Image className={""} src={"/img/notecell.png"} alt={""}/>
            </div>
        </div>
    );
};
