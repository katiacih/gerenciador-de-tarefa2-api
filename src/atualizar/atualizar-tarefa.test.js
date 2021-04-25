import { fireEvent, render, screen, waitFor} from '@testing-library/react'
import React from 'react'
import { 
   Link, 
   BrowserRouter, 
   Switch, 
   Route, 
   useHistory } from 'react-router-dom'
import { AtualizarTarefa } from './atualiza-tarefa'
import Tarefa from '../models/tarefa.model'
import axios from 'axios'

function Teste () {
   return (
      <div>
         <Link 
         data-testid='btn-abrir-atualizar'
         to={ `/atualizar/1`}>Link</Link>
      </div>
   )
}


function makeSut(){
   render(
      <BrowserRouter>
         <Switch>
            <Route exact path='/'><Teste/></Route>
            <Route path='/atualizar/:id'><AtualizarTarefa/></Route>
         </Switch>
      </BrowserRouter>
      
      )
}

describe('Atualizar tarefa', () => {
 
  beforeEach(() => {
   makeSut()
   })

   it('deve renderizar o componente sem erros', () => {
   fireEvent.click(screen.getByTestId('btn-abrir-atualizar'))
   expect(screen.getByTestId('atualizar-tarefa')).toBeInTheDocument()
   })

   it('deve tentar atualizar um texto menor que 5 caracteres', () => {
      fireEvent.click(screen.getByTestId('btn-abrir-atualizar'))
      const txtTarefa = screen.getByTestId('txt-tarefa')
      expect(txtTarefa).toBeInTheDocument()
      fireEvent.change(txtTarefa, {
         target: { value: 'Out'}
      })
      fireEvent.click(screen.getByTestId('btn-atualizar'))
      expect(screen.getByTestId('form')).toHaveTextContent('A tarefa deve conter ao menos 5 caracteres.')
      fireEvent.click(screen.getByTestId('voltar'))
   })

   it('deve atualizar com sucesso', async () => {
      fireEvent.click(screen.getByTestId('btn-abrir-atualizar'))
      const txtTarefa = screen.getByTestId('txt-tarefa')
      expect(txtTarefa).toBeInTheDocument()
      fireEvent.change(txtTarefa, {
         target: { value: 'tarefa modificada'}
      })
      fireEvent.click(screen.getByTestId('btn-atualizar'))
      expect(screen.getByTestId('modal')).toBeInTheDocument()
      expect(screen.getByTestId('modal')).toHaveTextContent('Sucesso')
      await waitFor(() => expect(axios.put.mockResolvedValue('OK')).toHaveBeenCalledTimes(1)) 
   })

})