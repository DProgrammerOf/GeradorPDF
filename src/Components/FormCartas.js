import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import {Header, Button, Form, Search, Select, Table, List} from 'semantic-ui-react'

const resultRenderer = ({ nome, rg }) => {
  return (
    <List>
      <List.Item>
        <List.Header>{nome}</List.Header>
        {rg}
      </List.Item>
    </List>
  )
}

resultRenderer.propTypes = {
  nome: PropTypes.string,
  rg: PropTypes.string,
}

class FormCartas extends React.Component {
  state = { isLoading: false, results: [], value: "", coligadas: [], empresas: [],
            colaborador: null, coligada: null, empresa: '', loja: '', textoemissao: '', periodioinicio: '', periodofim: '', cargo: ''};

  componentDidMount() {
    axios.get('http://localhost/api/coligadas.php')
    .then( res => {
        const optionsColigadoras = [];
        res.data.forEach(
          (element, index, array) => {
            optionsColigadoras.push({ key: index, text: element.nome, value: index, dados: element})
        });

       this.setState({coligadas: optionsColigadoras});
    })

    axios.get('http://localhost/api/empresas.php')
    .then( res => {
        const optionsEmpresas = [];
        res.data.forEach(
          (element, index, array) => {
            optionsEmpresas.push({ key: index, text: element.nome, value: index, dados: element})
        });

       this.setState({empresas: optionsEmpresas});
    })
  }

  handleResultSelect = (e, { result }) => {
      const User = {
        tipo: 'select',
        rg: result.rg
      }


      axios.get('http://localhost/api/colaboradores.php',
      {params: {User} })
      .then( res => {
        //console.log(res.data);

        this.setState({
          isLoading: false,
          colaborador: res.data,
          value: result.rg
        });

        this.props.onAttParamsPdf('ColaboradorPdf', res.data);
      });
    }

  handleSearchChange = (e, { value }) => {
      this.setState({ isLoading: true, value });
      //console.log(value);
      const User = {
        tipo: 'busca',
        nome: value
      }
      axios.get('http://localhost/api/colaboradores.php',
      {params: {User} })
      .then( res => {
        console.log(res.data);

        this.setState({
          isLoading: false,
          results: res.data
        });

        if (this.state.value.length < 1) return this.setState({results: []});
      })
    };

  handleChange = (e, { value }) => this.setState({ value })

  handleChangeColigadas = (e, {value}) => {
    this.setState({coligada: this.state.coligadas[value]});
    this.props.onAttParamsPdf('ColigadaPdf', this.state.coligadas[value]);
  }

  handleChangeEmpresas = (e, {value}) => {
    this.setState({empresa: this.state.empresas[value]});
    this.props.onAttParamsPdf('EmpresaPdf', this.state.empresas[value]);
  }

  handleChangeInput = (e, {name, value}) => {
    this.setState({[name]: value});
    if(name === 'empresa')
      this.props.onAttParamsPdf('EmpresaPdf', value)
    else if(name === 'loja')
      this.props.onAttParamsPdf('LojaPdf', value)
    else if(name === 'textoemissao')
      this.props.onAttParamsPdf('EmissaoPdf', value)
    else if(name === 'periodioinicio')
      this.props.onAttParamsPdf('PeriodoInicioPdf', value)
    else if(name === 'periodofim')
      this.props.onAttParamsPdf('PeriodoFimPdf', value)
    else if(name === 'cargo')
      this.props.onAttParamsPdf('CargoPdf', value)
  }

  handleGerarPdf = (e, {name}) => this.props.onAttParamsPdf('ModeloPdf', name)

  handleReset = () => {
   this.setState({colaborador: null, value: '',  loja: '', textoemissao: '', periodioinicio: '', periodofim: '', cargo: '', results: []});
    this.props.resetPdfs();
  }

  render() {
    const { isLoading, value, results, coligadas, empresas, coligada, empresa, loja, textoemissao, periodioinicio, periodofim, cargo } = this.state
    const { isOkModelo1, isOkModelo3, isOkModelo4, isOkModelo5 } = this.props
    return (
      <Form>
        <Header>Gerador de Cartas (.pdf)</Header>

        <Form.Group widths='equal'>
            <Form.Input required fluid name='textoemissao' value={textoemissao} onChange={this.handleChangeInput} label='Texto de emissão' placeholder='Informe o texto de emissão (Ex: São Paulo, 10 de Maio de 2019)' />
        </Form.Group>

        <Form.Field
          control={Select}
          options={coligadas}
          label={{ children: 'Coligada', htmlFor: 'form-select-control-coligada' }}
          placeholder='Informe a coligada'
          search
          searchInput={{ id: 'form-select-control-coligada' }}
          onChange={this.handleChangeColigadas}
          required
        />

        <Form.Field
          control={Select}
          options={empresas}
          label={{ children: 'Empresa', htmlFor: 'form-select-control-empresa' }}
          placeholder='Informe a empresa'
          search
          searchInput={{ id: 'form-select-control-empresa' }}
          onChange={this.handleChangeEmpresas}
          required
        />

        <Form.Group widths='equal'>
          <Form.Input fluid name='loja' value={loja} onChange={this.handleChangeInput} label='Loja' placeholder='Informe o nome da loja' />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input fluid name='periodioinicio' value={periodioinicio} onChange={this.handleChangeInput} label='Data Inicial' placeholder='Informe a data inicial' />
          <Form.Input fluid name='periodofim' value={periodofim} onChange={this.handleChangeInput} label='Data Final' placeholder='Informe a data final' />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input fluid name='cargo' value={cargo} onChange={this.handleChangeInput} label='Cargo' placeholder='Cargo do colaborador' />
        </Form.Group>

        <Form.Field required>
          <label>Colaborador</label>
          <Search
                  required
                  loading={isLoading}
                  onResultSelect={this.handleResultSelect}
                  onSearchChange={this.handleSearchChange}
                  placeholder="Procure pelo nome da pessoa"
                  results={results}
                  value={value}
                  resultRenderer={resultRenderer}
                  {...this.props}
          />
        </Form.Field>

        <Table>
           <Table.Header>
             <Table.Row>
               <Table.HeaderCell style={{textAlign:'center'}}>CARTA CLIENTE</Table.HeaderCell>
               <Table.HeaderCell style={{textAlign:'center'}}>Modelo 3</Table.HeaderCell>
               <Table.HeaderCell style={{textAlign:'center'}}>CARTA WALLMART</Table.HeaderCell>
               <Table.HeaderCell style={{textAlign:'center'}}>CARTA ATACADÃO</Table.HeaderCell>
             </Table.Row>
           </Table.Header>

           <Table.Body>
             <Table.Row>
               <Table.Cell>
                   <Form.Field fluid disabled={!isOkModelo1} color='green' name="Modelo1" onClick={this.handleGerarPdf} control={Button}>Gerar</Form.Field>
               </Table.Cell>
              <Table.Cell>
                   <Form.Field fluid disabled={!isOkModelo3} color='green' name="Modelo3" onClick={this.handleGerarPdf} control={Button}>Gerar</Form.Field>
               </Table.Cell>
               <Table.Cell>
                   <Form.Field fluid disabled={!isOkModelo4} color='green' name="Modelo4" onClick={this.handleGerarPdf} control={Button}>Gerar</Form.Field>
               </Table.Cell>
              <Table.Cell>
                   <Form.Field fluid disabled={!isOkModelo5} color='green' name="Modelo5" onClick={this.handleGerarPdf} control={Button}>Gerar</Form.Field>
               </Table.Cell>
             </Table.Row>
           </Table.Body>
         </Table>
         <Form.Group widths='equal'>
           <Form.Field fluid primary onClick={this.handleReset} control={Button}>Finalizar</Form.Field>
         </Form.Group>
      </Form>
    )
  }
}


export default FormCartas;
