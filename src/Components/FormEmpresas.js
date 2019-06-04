import React from 'react'
import axios from 'axios'
import { Header, Button, Form, Message} from 'semantic-ui-react'

class FormEmpresas extends React.Component {
  state = {
    nomeEmpresa: '',
    imageLogo: null, imageCarimbo: null,// Dados do Formulário
    formLoading: false, isSuccess: false, isError: false // Tratamento de Retornos
   }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleChangeFile = (e, {name}) => this.setState({ [name]: e.target.files[0]})

  imageSelectLogo = event => {
    this.setState({imageLogo: event.target.files[0]})
    console.log(event.target.files[0])
  }

  imageSelectCarimbo = event => {
    this.setState({imageCarimbo: event.target.files[0]})
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const User = {
      nome:               this.state.nomeEmpresa
    }

    this.setState({formLoading: true});
    axios.post(`http://localhost/api/empresas.php`, { User })
      .then(res => {
        //console.log(User);
        //console.log(res);
        if(res.data.status){
          const fd = new FormData();
          console.log(res.data);
          fd.append('imageLogo', this.state.imageLogo, this.state.imageLogo.name);
          fd.append('imageCarimbo', this.state.imageCarimbo, this.state.imageCarimbo.name);
          fd.append('idEmpresa', res.data.id);
          axios.post('http://localhost/api/uploadempresa.php', fd)
          .then( resUpdt => {
            if(resUpdt.data === 'Sucesso'){
              this.setState({nomeEmpresa: '', imageLogo: null, formLoading:false, isError: false, isSuccess: true})
            }
            else
              this.setState({formLoading:false, isError: true, isSuccess: false})

            //console.log(resUpdt);
          });
        }
        else {
          this.setState({formLoading:false, isError: true, isSuccess: false});
        }
        console.log(res.data);
      })

    return;
  }

  render() {
    const { nomeEmpresa, formLoading, isSuccess, isError } = this.state
    return (
      <Form success={isSuccess} warning={isError} loading={formLoading} onSubmit={this.handleSubmit}>
        <Header>Cadastro de Empresa</Header>
        <Message success header='Registrado' content="A empresa coligada foi registrada com sucesso no banco de dados." />
        <Message warning header='Algo errado' content="Pode existir uma empresa já registrado com esse ID." />

        <Form.Group widths='equal'>
          <Form.Input required fluid name='nomeEmpresa' value={nomeEmpresa} label='Empresa' placeholder='Nome da empresa' onChange={this.handleChange} />
        </Form.Group>

        <Form.Field required>
          <label>Logomarca</label>
          <input  type="file" onChange = {this.imageSelectLogo} accept=".png, .jpg, .jpeg" />
        </Form.Field>

        <Form.Field required>
          <label>Carimbo</label>
          <input type='file' onChange = {this.imageSelectCarimbo} accept=".png, .jpg, .jpeg" />
        </Form.Field>



        <Form.Field primary control={Button}>Registrar</Form.Field>
      </Form>
    )
  }
}


export default FormEmpresas;
