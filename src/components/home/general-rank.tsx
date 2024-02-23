import { Tab, Tabs } from "@nextui-org/react";
import { StudentsScoreList } from "../podium/score-list";
import { ThreeBestPodium } from "../podium/three-best";

const mockedGlobalStudents = [
  {
    id: '1',
    name: "Guilherme TypeScript",
    score: 9999,
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: '2',
    name: "Gabriela JavaScript",
    score: 9998,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: '3',
    name: "Francis Pires",
    score: 1985,
    image: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  },
  {
    id: '4',
    name: "Ana Node",
    score: 7654,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: '5',
    name: "Adriano CSharp",
    score: 3490,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: '6',
    name: "Marcelo Rust",
    score: 2567,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: '7',
    name: "Maria Ruby",
    score: 743,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
]

const mockedClassStudents = [
  {
    id: '1',
    name: "Leandro Next",
    score: 6789,
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: '2',
    name: "Xavier React",
    score: 6788,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: '3',
    name: "Francis Pires",
    score: 1985,
    image: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  },
  {
    id: '4',
    name: "Marcela Assembly",
    score: 5342,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: '5',
    name: "Roberto Golang",
    score: 2345,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: '6',
    name: "Marcelo Angular",
    score: 1234,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: '7',
    name: "Maria Vue",
    score: 5467,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
]

export const GeneralRank = () => {
  const sortedGlobalStudents = mockedGlobalStudents.sort((a, b) => b.score - a.score)
  const sortedClassStudents = mockedClassStudents.sort((a, b) => b.score - a.score)
  const userPosition = sortedClassStudents.findIndex((student) => student.id === '3')

  return (
    <>
      <Tabs key="podium" variant="underlined" aria-label="Tabs podium" className="mx-auto hover:border-none">
        <Tab key="global" title="Global">
          <h1 className="mb-14 font-base">Ranking global</h1>
          <div className="flex flex-wrap items-center justify-between md:gap-8 gap-4">
            <ThreeBestPodium
              first={sortedGlobalStudents[0]}
              second={sortedGlobalStudents[1]}
              third={sortedGlobalStudents[2]}
            />
            <div className="flex-1">
              <StudentsScoreList students={sortedGlobalStudents} firstIndexValue={3} />
            </div>
          </div>
        </Tab>
        <Tab key="class" title="Turma">
          <h1 className="mb-2 font-base">Ranking da turma</h1>
          {userPosition === 0 ? (
            <>
              <h2 className="font-bold text-2xl mb-3">Parabéns você está em <span className="text-4xl text-yellow-500">1º</span></h2>
              <span className="block font-base mb-10">Continue assim!</span>
            </>
          ) : (
            <>
              <h2 className="font-bold text-2xl mb-3">Você está em {userPosition + 1}º</h2>
              <span className="block font-base mb-10">Continue progredindo!</span>
            </>
          )}
          <StudentsScoreList students={sortedClassStudents} isLarge />
        </Tab>
      </Tabs>
    </>
  )
}
