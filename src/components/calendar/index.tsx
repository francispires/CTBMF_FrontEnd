import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import _default from '@fullcalendar/core/locales/pt-br'
export default class Calendar extends React.Component {
    render() {
        return (

                    <FullCalendar
                        plugins={[ dayGridPlugin ]}
                        initialView="dayGridMonth"
                        locale={_default}
                        events={[
                            { title: 'event 1', date: '2024-01  -01' },
                            { title: 'event 2', date: '2024-01-02' }
                        ]}
                    />
        )
    }
}