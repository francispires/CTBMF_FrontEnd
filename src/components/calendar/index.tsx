import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import _default from '@fullcalendar/core/locales/pt-br'
import {Card, CardBody, CardFooter, CardHeader, Divider, Link, Image, Tooltip, Button} from '@nextui-org/react';

export default class Calendar extends React.Component {

    render() {
        const events = [
            {
                "start": "2024-03-23",
                "title": "Recepção dos Alunos – Online",
                "items": []
            },
            {
                "start": "2024-04-06",
                "title": "1° Módulo – Presencial",
                "items": [
                    "Saúde Pública",
                    "Ferimentos por arma de fogo",
                    "Fratura nasal + NOE"
                ]
            },
            {
                "start": "2024-04-20",
                "title": "1° Discussão de Questões – Online",
                "items": [
                    "Serviço: USP"
                ]
            },
            {
                "start": "2024-04-27",
                "title": "1° Módulo Extra – Online",
                "items": [
                    "Osteologia da face",
                    "Farmacologia I",
                    "Cistos odontogênicos e não odontogênicos",
                    "Imaginologia I"
                ]
            },
            {
                "start": "2024-05-18",
                "title": "Curso de Atualização em Emergências Médicas – Presencial",
                "items": [
                    "Curso teórico-prático. A prática não será transmitida."
                ]
            },
            {
                "start": "2024-06-08",
                "title": "2° Módulo – Online",
                "items": [
                    "Miologia da face",
                    "Tumores odontogênicos",
                    "Anestesiologia I",
                    "Infecções odontogênicas"
                ]
            },
            {
                "start": "2024-06-15",
                "title": "2ª Discussão de Questões – Online",
                "items": [
                    "Tema: Saúde Pública"
                ]
            },
            {
                "start": "2024-06-22",
                "title": "3° Módulo – Presencial",
                "items": [
                    "Imaginologia II",
                    "Farmacologia II",
                    "Fratura de maxila",
                    "Exames complementares"
                ]
            },
            {
                "start": "2024-07-06",
                "title": "2° Módulo Extra – Online",
                "items": [
                    "Vascularização da face",
                    "Patologia das lesões fibro-ósseas",
                    "Anestesiologia II",
                    "Implantodontia"
                ]
            },
            {
                "start": "2024-07-08",
                "end": "2024-07-10",
                "title": "3° Edição Projeto Férias – Online",
                "items": []
            },
            {
                "start": "2024-07-20",
                "title": "4° Módulo – Online",
                "items": [
                    "Patologia das glândulas salivares",
                    "Fissurados",
                    "Inervação da face"
                ]
            },
            {
                "start": "2024-07-27",
                "title": "3° Discussão de Questões – Online",
                "items": [
                    "Serviço: Mário Gatti"
                ]
            },
            {
                "start": "2024-08-03",
                "title": "5° Módulo – Presencial",
                "items": [
                    "Acessos cirúrgicos",
                    "Farmacologia III",
                    "Trauma dentoalveolar",
                    "ATLS"
                ]
            },
            {
                "start": "2024-08-17",
                "title": "3° Módulo Extra – Online",
                "items": [
                    "Síndromes",
                    "Infecções virais, bacterianas e fúngicas",
                    "Cirurgia pré-protética e parendodôntica"
                ]
            },
            {
                "start": "2024-08-31",
                "title": "6° Módulo – Online",
                "items": [
                    "Princípios de estomatologia e biópsias",
                    "Cirurgia ortognática",
                    "Apneia do sono",
                    "Biossegurança"
                ]
            },
            {
                "start": "2024-09-14",
                "title": "4° Módulo Extra – Online",
                "items": [
                    "Farmacologia IV",
                    "Fratura de mandíbula",
                    "Lesão de tecido mole",
                    "Desordens potencialmente malignas e cancerologia"
                ]
            },
            {
                "start": "2024-09-21",
                "title": "4° Discussão de Questões – Online",
                "items": [
                    "Serviço: UERJ"
                ]
            },
            {
                "start": "2024-09-28",
                "title": "7° Módulo – Presencial",
                "items": [
                    "Anestesiologia III",
                    "Fratura frontal e panfacial",
                    "Manejo de pacientes sistemicamente comprometidos",
                    "Fratura de órbita"
                ]
            },
            {
                "start": "2024-10-19",
                "title": "8° Módulo – Online",
                "items": [
                    "Anatomia, classificação, diagnóstico e tratamento das DTM´s",
                    "Osteonecrose e Osteorradionecrose dos maxilares",
                    "Princípios de fixação em CTBMF",
                    "Cirurgia oral menor"
                ]
            },
            {
                "start": "2024-11-09",
                "title": "Revisão Geral",
                "items": [
                    "A programação será lançada na véspera do evento"
                ]
            }
        ]


        // @ts-ignore
        const EventDetail = ({event}) => {
            const content =
                <Tooltip
                    content={
                        <div className="px-1 py-1">
                            <div className="text-small font-bold">{event.title}</div>
                            <div className="text-tiny">
                                {event.extendedProps.items.map((item, index) => (
                                    <div key={index}>{item}</div>
                                ))}
                            </div>
                        </div>
                    }
                >
                    <div className={"flex flex-col h-auto justify-center text-center whitespace-break-spaces"}>
                        {event.title}
                    </div>
                </Tooltip>;
            return content;
        };
        return (

            <FullCalendar
                dayHeaderClassNames={['text-danger-700']}
                eventClassNames={['text-danger-900 bg-red-700']}
                eventContent={EventDetail}
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                locale={_default}
                events={events}
            />
        )
    }
}