import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { RemoverTarefa } from './remover-tarefa'
import Tarefa from '../models/tarefa.model'
import axios from 'axios'
jest.mock('axios');

const nomeTarefa = 'tarefa de teste'

const makeSut = () => {
  const tarefa = new Tarefa(1, nomeTarefa, false)
  render(<RemoverTarefa
    recarregarTarefas = {() => {}}
    tarefa={ tarefa }/>)
}

describe('Remover Tarefa', () => {
 beforeEach(() => {
  makeSut()
 })

 it('deve renderizar o componente sem erros', () => {
  expect(screen.getByTestId('remover-tarefa')).toBeInTheDocument()
 })

 it('deve exibir o modal', () => {
  fireEvent.click(screen.getByTestId('btn-abrir-modal'))
  expect(screen.getByTestId('modal')).toBeInTheDocument()
  expect(screen.getByTestId('modal')).toHaveTextContent('tarefa de teste')
})

it('deve remover uma tarefa', async () => {
  const nomeTarefa = 'tarefa de teste'
   fireEvent.click(screen.getByTestId('btn-abrir-modal'))
   fireEvent.click(screen.getByTestId('btn-remover'))
   await screen.findByTestId('modal')
   expect(axios.delete.mockResolvedValue('OK')).toHaveBeenCalledTimes(1)
 })

})