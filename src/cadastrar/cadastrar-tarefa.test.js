import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { CadastrarTarefa } from './cadastrar-tarefa'
import { BrowserRouter } from 'react-router-dom'
jest.mock('axios');
import axios from 'axios'
import Tarefa from '../models/tarefa.model';

const nomeTarefa = 'nova tarefa a ser incluida'

const makeSut = () => {
   render(
  <BrowserRouter>
    <CadastrarTarefa/>
  </BrowserRouter>
   )
 }

describe('Cadastrar Tarefa', () => {
  const resp = {
    data: {
      tarefa: new Tarefa(1, nomeTarefa, false)
      }
  }

 beforeEach(() => {
   axios.post.mockResolvedValue(resp)
   makeSut()
 })

 it('deve renderizar o componente sem erros', () => {
  expect(screen.getByTestId('cadastrar')).toBeInTheDocument()
  expect(screen.getByRole('form')).toBeInTheDocument()
})

it('deve cadastrar uma nova tarefa', async () => {
   const txtTarefa = screen.getByTestId('txt-tarefa')
   fireEvent.change(txtTarefa, { target: {value: nomeTarefa}});
   fireEvent.submit(screen.getByRole('form'));
   await waitFor(() => screen.getByTestId('modal'))
   expect(screen.getByTestId('modal')).toBeInTheDocument();
   expect(screen.getByTestId('modal')).toHaveTextContent('Sucesso');
   expect(screen.getByTestId('modal')).toHaveTextContent('Tarefa adicionada com sucesso!');
})

})