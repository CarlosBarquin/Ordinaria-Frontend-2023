import { gql, useMutation, useQuery} from "@apollo/client";
import { dirname } from "node:path/win32";
import { disconnect, eventNames } from "process";
import { use, useEffect, useState } from "react";
import { ObjectId } from 'mongodb';
import Link from "next/link";


const GET_EVENTS = gql`
    query{
        events {
        id
        title
        description
        date
        startHour
        endHour
        }
  }
`

const CREATE_EVENT = gql`
    mutation($title: String!, $description: String!, $date: Date!, $startHour: Int!, $endHour: Int!){
        createEvent(title: $title, description: $description, date: $date, startHour: $startHour, endHour: $endHour) {
        title
        date
        }
    }
`

const UPDATE_EVENT = gql`
mutation($updateEventId: ID!, $title: String!, $description: String!, $date: Date!, $startHour: Int!, $endHour: Int!){
    updateEvent(id: $updateEventId, title: $title, description: $description, date: $date, startHour: $startHour, endHour: $endHour) {
      id
      title
    }
  }

`

const DELETE_EVENT = gql`

mutation($deleteEventId: ID!){
    deleteEvent(id: $deleteEventId) {
      title
      id
    }
  }

`

const pagina = () => {

    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [date, setDate] = useState<Date>()
    const [startHour, setStartHour] = useState<number>(0)
    const [endHour, setEndHour] = useState<number>(0)


    
    const [title2, setTitle2] = useState<string>("")
    const [description2, setDescription2] = useState<string>("")
    const [date2, setDate2] = useState<Date>()
    const [startHour2, setStartHour2] = useState<number>(0)
    const [endHour2, setEndHour2] = useState<number>(0)


    const [id, setId] = useState<string>("")
    const [id2, setId2] = useState<string>("")
    const [e, sete] = useState<number>(0)
    const [isDivVisible, setDivVisible] = useState<boolean>(false);
    const [selectedEventId, setSelectedEventId] = useState<string>("")

    const { loading, error, data, refetch } = useQuery<{
        events: {
            id : string
            title: string
            description: string
            date : Date
            startHour : number
            endHour : number
        }[];
    }>(GET_EVENTS);

    const [createEvent] = useMutation(CREATE_EVENT, {
        variables : {title,description,date,startHour,endHour},
        onCompleted: () => {
          refetch();
        },
        onError: (error) => {
          const errorMessage = error.message; 
          const errorMessageElement = document.getElementById('error-message');
          errorMessageElement!.textContent = errorMessage; 
        }
    });

    
    const [deleteEvent] = useMutation(DELETE_EVENT, {
        variables : {deleteEventId: id},
        onCompleted: () => {
          refetch();
        },
        onError: (error) => {
          const errorMessage = error.message; 
          const errorMessageElement = document.getElementById('error-message2');
          errorMessageElement!.textContent = errorMessage; 
        }
    });

    const [updateEvent] = useMutation(UPDATE_EVENT, {
      variables : {updateEventId : id2, title: title2, description: description2, date: date2, startHour: startHour2, endHour: endHour2 },
      onCompleted: () => {
         refetch()
      },
      onError: (error) => {
        const errorMessage = error.message; 
        const errorMessageElement = document.getElementById('error-message3');
        errorMessageElement!.textContent = errorMessage; 
      }
  });



    useEffect(() =>{
        if(id == "") return
        deleteEvent()
    },[id])


    useEffect(() =>{
      if(id2 == "") return
      updateEvent()
   },[id2,e])


    const toggleDivVisibility = () => {
      setDivVisible(!isDivVisible);
    };
  


  

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    
      return (
          <>   
          <h1>Crear</h1>
          <input type="datetime-local" placeholder="date" onChange={(e) => {
            
            const date = new Date(e.target.value)
            date.setHours(startHour, 0)
            
            setDate(date)
            
            
            } } />
          <input type="text" placeholder="title" onChange={(e) => { setTitle(e.target.value) }} />
          <input type="text" placeholder="description" onChange={(e) => {  setDescription(e.target.value) }} />
          <input type="number" placeholder="sarathour" onChange={(e) => { setStartHour(parseInt(e.target.value)) }} />
          <input type="number" placeholder="endtHour" onChange={(e) => { setEndHour(parseInt(e.target.value)) }} />
          <div id="error-message"></div>
          <div id="error-message2"></div>
        <button onClick={() => {
            createEvent();
        }
        }>crear</button>

          <h2>Eventos de ahora en adelante</h2>
          {data?.events.map((event) => {

            return (
                <>
                 <div key={event.id} onClick={()=>{
                      toggleDivVisibility()
                      setSelectedEventId(event.id)
                 }} >
                    {<Link href={`/evento/${event.id}`}>{event.title}</Link>}--
                    {event.description}--
                    {event.date.toString().substring(0,10)}--
                    {event.startHour}--
                    {event.endHour}--
                    <button onClick={() => {
                        setId(event.id)
                    }}>eliminar</button>
                 </div>
                    { isDivVisible && selectedEventId === event.id && (<div id="formulario">

                      <input type="datetime-local" placeholder="date" onChange={(e) => {
                                
                                const date = new Date(e.target.value)
                                date.setHours(startHour, 0)
                                
                                setDate2(date)
                                
                                
                                } } />
                              <input type="text" placeholder="title" onChange={(e) => { setTitle2(e.target.value) }} />
                              <input type="text" placeholder="description" onChange={(e) => {  setDescription2(e.target.value) }} />
                              <input type="number" placeholder="sarathour" onChange={(e) => { setStartHour2(parseInt(e.target.value)) }} />
                              <input type="number" placeholder="endtHour" onChange={(e) => { setEndHour2(parseInt(e.target.value)) }} />
                            <button onClick={() => {
                              setId2(event.id)
                              sete(e+1)
                            }
                            }>updatear</button>
                            <div id="error-message3"></div>

                      </div>)
                  }
                  <br></br>
                  <br></br>
                </>
            )
          })}
        
          
          </>
      )
  }
  
  export default pagina;