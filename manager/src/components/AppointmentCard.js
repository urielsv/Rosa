import React from 'react';

const AppointmentCard = ({ chatId, url, keyv, name, id, symptoms, pain, type, deleteFirstAppointment }) => {
    const openMeeting = () => {
    console.log(url);
        window.open(url, '_blank');
    };

    return (
        <div className="flex my-2 border-2 rounded-2xl">
            <p className="content-center rounded-l-2xl bg-green-400 p-3">{keyv}</p>
            <div className="w-48 bg-gray-200 text-left p-3">
                <h2 className="font-bold text-3xl">{name}</h2>
                <p>DNI: {id}</p>
                <p>Sintomas: {symptoms}</p>
                <p>Dolor: {pain}</p>
                <p>Tipo: {type}</p>
            </div>
            <div className="content-center px-12 text-2xl">
                <button className="bg-gray-200 border-2 rounded-full w-full px-3 h-1/3"
                        onClick={openMeeting}>Llamar por Zoom</button>
            </div>
            <div className="content-center px-12 text-2xl">
                <button className="bg-gray-200 border-2 rounded-full w-full px-3 h-1/3"
                        >+ PDF</button>
            </div>
            <div className="content-center px-12 text-2xl">
                {keyv === 1 && <button className="bg-green-200 border-2 rounded-full w-full px-3 h-1/3"
                        onClick={deleteFirstAppointment}>Finalizar turno</button>}

            </div>
        </div>
    )
}

export default AppointmentCard;
