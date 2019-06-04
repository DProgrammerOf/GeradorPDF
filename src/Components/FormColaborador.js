import React from 'react'
import axios from 'axios'
import {Header, Button, Form, Message} from 'semantic-ui-react'


class FormColaborador extends React.Component {
  state = {
    nomeCompleto: '', rg: '', cpf: '', ctps: '', cidade: '', estado: '', rua: '', bairro: '', nacionalidade: '', statussocial: '', pis: '', // Dados do Formulário
    formLoading: false, isSuccess: false, isError: false // Tratamento de Retornos
   }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = (e) => {
    e.preventDefault();

    const User = {
      rg:             this.state.rg,
      nome:           this.state.nomeCompleto,
      cpf:            this.state.cpf,
      ctps:           this.state.ctps,
      cidade:         this.state.cidade,
      estado:         this.state.estado,
      rua:            this.state.rua,
      bairro:         this.state.bairro,
      nacionalidade:  this.state.nacionalidade,
      statussocial:   this.state.statussocial,
      pis:            this.state.pis
    }
    this.setState({formLoading: true});
    axios.post(`http://localhost/api/colaboradores.php`, { User })
      .then(res => {
        //console.log(User);
        //console.log(res);
        if(res.data.status)
          this.setState({formLoading:false, isError: false, isSuccess: true});
        else {
          this.setState({formLoading:false, isError: true, isSuccess: false});
        }
        console.log(res.data);
      })

    return;
  }

  render() {
    const { nomeCompleto, rg, cpf, ctps, cidade, estado, rua, bairro, nacionalidade, statussocial, pis, formLoading, isSuccess, isError } = this.state
    return (
      <Form success={isSuccess} warning={isError} loading={formLoading} onSubmit={this.handleSubmit}>
        <Header>Cadastro de Funcionário</Header>
        <Message success header='Adicionado' content="O colaborador foi cadastrada com sucesso no banco de dados." />
        <Message warning header='Algo errado' content="Pode existir um colaborador já registrado com esse RG." />


        <Form.Group widths='equal'>
          <Form.Input fluid name='nomeCompleto' value={nomeCompleto} label='Nome' placeholder='Nome Completo' onChange={this.handleChange} />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input required fluid type='number' name='rg' value={rg} label='RG' placeholder='Registro Geral' onChange={this.handleChange} />
          <Form.Input fluid name='cpf' value={cpf} label='CPF' placeholder='Cadastro de Pessoa Física' onChange={this.handleChange} />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input fluid name='ctps' value={ctps} label='N° CTPS' placeholder='Carteira de Trabalho e Previdência Social.' onChange={this.handleChange} />
          <Form.Input fluid name='pis' value={pis} label='PIS e Série' placeholder='Informe o PIS e Série ' onChange={this.handleChange} />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input fluid name='rua' value={rua} label='Rua e N°' placeholder='Rua e número residência.' onChange={this.handleChange} />
          <Form.Input fluid name='bairro' value={bairro} label='Bairro' placeholder='Bairro residência.' onChange={this.handleChange} />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input fluid name='cidade' value={cidade} label='Cidade' placeholder='Informe a cidade.' onChange={this.handleChange} />
          <Form.Input fluid name='estado' value={estado} label='Estado' placeholder='Abreviado. (Ex: RJ, SP)' onChange={this.handleChange} />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input fluid name='nacionalidade' value={nacionalidade} label='Nacionalidade' placeholder='(Ex: Brasileira)' onChange={this.handleChange} />
          <Form.Input fluid name='statussocial' value={statussocial} label='Status Social' placeholder='(Ex: Solteiro)' onChange={this.handleChange} />
        </Form.Group>


        <Form.Field primary control={Button}>Adicionar</Form.Field>
      </Form>
    )
  }
}


export default FormColaborador;
