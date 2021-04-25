import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { ItemListaTarefa } from './itens-lista-tarefa'
import { Paginacao } from './paginacao'
import axios from 'axios'

export function ListarTarefas() {
 const ITENS_POR_PAG = 3
 const API_URL_LISTAR_TAREFAS = 'http://localhost:3001/gerenciador-tarefas'

 const [tarefas, setTarefas] = useState([]);
 const [carregarTarefas, setCarregarTarefas] = useState(true);
 const [totalItens, setTotalItens] = useState(0)
 const [paginaAtual, setPaginaAtual] = useState(1)
 const [ordenarAsc, setOrdenarAsc] = useState(false)
 const [ordenarDesc, setOrdenarDesc] = useState(false)
 const [filtroTarefa, setFiltroTarefa] = useState('');

 useEffect(() => {
  async function obterTarefas() {
      // ordenar
      let ordem = '';
      if (ordenarAsc) {
        ordem = 'ASC';
      } else if (ordenarDesc) {
        ordem = 'DESC';
      }
      let res = ''
      try {
        const params = `?pag=${paginaAtual}&ordem=${ordem}&filtro-tarefa=${filtroTarefa}`;
        let { data } = await axios.get(API_URL_LISTAR_TAREFAS + params);
        setTotalItens(data.totalItems);
        setTarefas(data.tarefas);
      } catch(err) {
        setTarefas([]);
      }
  }
  if (carregarTarefas) {
    obterTarefas();
    setCarregarTarefas(false);
  }
}, [carregarTarefas, paginaAtual, ordenarAsc, ordenarDesc, filtroTarefa]);
 function handleMudarPagina(pagina) {
   setPaginaAtual(pagina)
   setCarregarTarefas(true)
 }

 function handleOrdenar(event){
   event.preventDefault()
   if(!ordenarAsc && !ordenarDesc){
     setOrdenarAsc(true)
     setOrdenarDesc(false)
   } else if( ordenarAsc) {
     setOrdenarAsc(false)
     setOrdenarDesc(true)
   }else{
    setOrdenarAsc(false)
    setOrdenarDesc(false)
   }
   setCarregarTarefas(true);
 }

 function handleFiltrar(event) {
  setFiltroTarefa(event.target.value);
  setCarregarTarefas(true);
}

 return (
  <div className='text-center'>
   <h3>Tarefas a fazer</h3>
   <Table striped bordered hover responsive data-testid='tabela'>
    <thead>
     <tr>
      <th><a
        href='/'
        onClick={handleOrdenar}
      >Tarefa</a></th>
      <th>
        {/* <Router> */}
      <Link 
        data-testid='btn-nova-tarefa'
        to="/cadastrar" 
        className="btn btn-success btn-sm">
          <FontAwesomeIcon icon={faPlus}/>
          &nbsp;
          Nova Tarefa</Link>

        {/* </Router> */}
      </th>
     </tr>
     <tr>
       <th>
         <Form.Control 
          type='text'
          value={filtroTarefa}
          onChange={handleFiltrar}
          data-testid='txt-tarefa'
          className='filtro-tarefa'
         />
       </th>
     </tr>
    </thead>
    <tbody>
     <ItemListaTarefa 
      tarefas={tarefas}
      recarregarTarefas={setCarregarTarefas}/>
    </tbody>
   </Table>
    
   <Paginacao
    totalItens={totalItens}
    itemsPorPagina={ITENS_POR_PAG}
    paginaAtual = {paginaAtual}
    mudarPagina = {handleMudarPagina}
   />

  </div>
     // <A href="/cadastrar" className="btn btn-success btn-sm">Nova Tarefa</A>
 )
}