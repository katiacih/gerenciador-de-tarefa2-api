import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios'
jest.mock('axios');
import { ListarTarefas } from './listar-tarefas'
import Tarefa from '../models/tarefa.model'


const makeSut = () => {
  render(
  <BrowserRouter>
    <ListarTarefas/>  
  </BrowserRouter>
  )
}

describe('Listar Tarefas', () => {
  const nomePrimeiraTarefa = 'Primeira tarefa';
  const nomeSegundaTarefa = 'Segunda tarefa';
  const nomeTerceiraTarefa = 'Terceira tarefa';

  const resp = {
    data: {
      totalItems: 3,
      tarefas: [
        new Tarefa(1, nomePrimeiraTarefa, false),
        new Tarefa(2, nomeSegundaTarefa, false),
        new Tarefa(3, nomeTerceiraTarefa, false)
      ],
      pagina: 1
      }
    }

 beforeEach( async () => {
  axios.get.mockResolvedValue(resp)
  makeSut()
  await waitFor(() => screen.getAllByTestId('tarefa'))
 })

 it('deve renderizar o componente sem erros', () => {
  expect(screen.getByTestId('tabela')).toBeInTheDocument()
 })

 it('deve exibir uma tabela contendo 3 tarefas', async () => {
//  const items = await waitFor(() => screen.getAllByTestId('tarefa'))
 const items = screen.getAllByTestId('tarefa')
 expect(items.length).toBe(3)
 expect(screen.getByTestId('tabela')).toHaveTextContent(nomePrimeiraTarefa)
 expect(screen.getByTestId('tabela')).toHaveTextContent(nomeSegundaTarefa)
 expect(screen.getByTestId('tabela')).toHaveTextContent(nomeTerceiraTarefa)
 })

 it('deve filtrar os dados da tabela de tarefas', async () => {
   fireEvent.change(screen.getByTestId('txt-tarefa'), {
     target: { value: nomePrimeiraTarefa }
    })
  await waitFor(() => screen.getAllByTestId('tarefa'))
  expect(screen.getByTestId('tabela')).toHaveTextContent(nomePrimeiraTarefa)
  // expect(screen.getByTestId('tabela')).not.toHaveTextContent(nomeSegundaTarefa)
  // expect(screen.getByTestId('tabela')).not.toHaveTextContent(nomeTerceiraTarefa)
 })

})