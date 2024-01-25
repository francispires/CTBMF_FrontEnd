import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import _default from '@fullcalendar/core/locales/pt-br'
export default class Calendar extends React.Component {
    render() {
        return (

                    <FullCalendar
                        dayHeaderClassNames={['text-danger-500']}
                        eventClassNames={['text-danger-500 font-sm']}
                        plugins={[ dayGridPlugin ]}
                        initialView="dayGridMonth"
                        locale={_default}
                        events={[
                            { title: 'Sparing Policia Federal', date: '2024-01-01' },
                            { title: 'Sparing Hospital das Clínicas', date: '2024-01-15' }
                        ]}
                    />
        )
    }
}