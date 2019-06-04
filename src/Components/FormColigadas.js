import React from 'react'
import axios from 'axios'
import { Header, Button, Form, Message} from 'semantic-ui-react'

class FormColigadas extends React.Component {
  state = {
    nomeEmpresa: '', cnpjmf: '', cidade: '', estado: '', rua: '', statusinscricao: '', cep: '',
    imageCarimbo: null, imageLogo: null, // Dados do Formulário
    formLoading: false, isSuccess: false, isError: false // Tratamento de Retornos
   }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleChangeFile = (e, {name}) => this.setState({ [name]: e.target.files[0]})

  imageSelectLogo = event => {
    this.setState({imageLogo: event.target.files[0]})
  //  console.log(event.target.files[0])
  }

  imageSelectCarimbo = event => {
    this.setState({imageCarimbo: event.target.files[0]})
  //  console.log(event.target.files[0])
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const User = {
      nome:               this.state.nomeEmpresa,
      cnpjmf:             this.state.cnpjmf,
      cidade:             this.state.cidade,
      estado:             this.state.estado,
      rua:                this.state.rua,
      statusinscricao:    this.state.statusinscricao,
      cep:                this.state.cep
    }

    this.setState({formLoading: true});
    axios.post(`http://localhost/api/coligadas.php`, { User })
      .then(res => {
        //console.log(User);
        //console.log(res);
        if(res.data.status){
          const fd = new FormData();
          fd.append('imageLogo', this.state.imageLogo, this.state.imageLogo.name);
          fd.append('imageCarimbo', this.state.imageCarimbo, this.state.imageCarimbo.name);
          fd.append('idEmpresa', res.data.id);
          axios.post('http://localhost/api/upload.php', fd)
          .then( resUpdt => {
            if(resUpdt.data === 'Sucesso'){
              this.setState({nomeEmpresa: '', cnpjmf: '', cidade: '', estado: '', rua: '', statusinscricao: '',
                            imageCarimbo: null, imageLogo: null, formLoading:false, isError: false, isSuccess: true})
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
    const { nomeEmpresa, cnpjmf, cidade, estado, rua, statusinscricao, cep, formLoading, isSuccess, isError } = this.state
    return (
      <Form success={isSuccess} warning={isError} loading={formLoading} onSubmit={this.handleSubmit}>
        <Header>Cadastro de Coligada</Header>
        <Message success header='Registrado' content="A empresa coligada foi registrada com sucesso no banco de dados." />
        <Message warning header='Algo errado' content="Pode existir uma empresa já registrado com esse ID." />

        <Form.Group widths='equal'>
          <Form.Input required fluid name='nomeEmpresa' value={nomeEmpresa} label='Empresa' placeholder='Nome da empresa' onChange={this.handleChange} />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input required fluid name='cidade' value={cidade} label='Cidade' placeholder='Informe a cidade.' onChange={this.handleChange} />
          <Form.Input required fluid name='estado' value={estado} label='Estado' placeholder='Abreviado. (Ex: RJ, SP)' onChange={this.handleChange} />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input required fluid name='rua' value={rua} label='Endereço' placeholder='(EX: Rua exemplo, 41 - Bairro)' onChange={this.handleChange} />
          <Form.Input required fluid name='cep' value={cep} label='CEP' placeholder='Informe o CEP.' onChange={this.handleChange} />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input required fluid name='cnpjmf' value={cnpjmf} label='CNPJ/MF' placeholder='Informe o Cnpj/Mf.' onChange={this.handleChange} />
          <Form.Input required fluid name='statusinscricao' value={statusinscricao} label='Status de Inscrição' placeholder='Receita. (Ex: ISENTO)' onChange={this.handleChange} />
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


export default FormColigadas;
