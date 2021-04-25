import React, {useState, useEffect } from 'react';
// import PropTypes from 'prop-types'
import { Button, Form, Jumbotron, Modal} from 'react-bootstrap'
import { Link, useHistory, useParams } from 'react-router-dom'
import axios from 'axios';
import Tarefa from '../models/tarefa.model';

export function AtualizarTarefa (props) {
  const API_URL_TAREFAS = 'http://localhost:3001/gerenciador-tarefas/';

 let { id } = useParams();
 let history = useHistory();
 const [exibirModal, setExibirModal] = useState(false);
  const [formValidado, setFormValidado] = useState(false);
  const [tarefa, setTarefa] = useState('');
  const [carregarTarefa, setCarregarTarefa] = useState(true);
  const [exibirModalErro, setExibirModalErro] = useState(false)

  useEffect(() => {
    async function obterTarefa() {
      try {
        let { data } = await axios.get(API_URL_TAREFAS + id);
        setTarefa(data.nome);
      } catch(err) {
        history.push("/");
      }
    }

    if (carregarTarefa) {
      obterTarefa();
      setCarregarTarefa(false);
    }
  }, [carregarTarefa, id, history, props]);

  function voltar(event) {
    event.preventDefault();
    history.push("/");
  }

  function handleFecharModal() {
    history.push("/");
  }

  function handleFecharModalErro() {
    setExibirModalErro(false)
  }

  async function atualizar(event) {
    event.preventDefault();
    setFormValidado(true);
    if (event.currentTarget.checkValidity() === true) {
      try {
        const tarefaAtualizar = new Tarefa(null, tarefa, false);
        await axios.put(API_URL_TAREFAS + id, tarefaAtualizar);
        setExibirModal(true);
      } catch(err) {
        setExibirModalErro(true);
      }
    }
  }

  function handleTxtTarefa(event) {
    setTarefa(event.target.value);
  }

 return (
  <div data-testid='atualizar-tarefa'>
   <h3 className='text-center'>Atualizar Tarefa</h3>
   <Jumbotron>
        <Form data-testid='form' onSubmit={atualizar} noValidate validated={formValidado}>
          <Form.Group>
            <Form.Label>Tarefa</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite a tarefa"
              minLength="5"
              maxLength="100"
              required
              data-testid="txt-tarefa"
              value={tarefa}
              onChange={handleTxtTarefa} />
            <Form.Control.Feedback type="invalid">
              A tarefa deve conter ao menos 5 caracteres.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="text-center">
            <Button variant="success" type="submit" data-testid="btn-atualizar">
              Atualizar
            </Button>
            &nbsp;
            <Link data-testid='voltar' href="/" className="btn btn-light" onClick={voltar}>
              Voltar
            </Link>
          </Form.Group>
        </Form>
        <Modal show={exibirModal} onHide={handleFecharModal} data-testid="modal">
          <Modal.Header closeButton>
            <Modal.Title>Sucesso</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Tarefa atualizada com sucesso!
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleFecharModal}>
              Continuar
            </Button>
          </Modal.Footer>
        </Modal>

      {/* Modal erro */}
      <Modal
      data-testid='modal-erro' 
      show={exibirModalErro} onHide={handleFecharModalErro}>
      <Modal.Header closeButton>
        <Modal.Title>Erro</Modal.Title>
      </Modal.Header>
      <Modal.Body>Erro ao atualizar tarefa, tente novamente em instantes</Modal.Body>
      <Modal.Footer>
        <Button variant='warning' onClick={handleFecharModalErro}>Fechar</Button>
      </Modal.Footer>
      </Modal>
      </Jumbotron>
  </div>
 );
}

// AtualizarTarefa.propTypes = {
//  id: PropTypes.number.isRequired
// }