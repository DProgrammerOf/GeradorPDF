import React from 'react'
import {Icon, Menu, Container} from 'semantic-ui-react'
import FormColigadas from './FormColigadas.js'
import FormColaborador from './FormColaborador.js'
import FormCartas from './FormCartas.js'
import FormEmpresas from './FormEmpresas.js'

// Sistema de PDFs
import { PDFViewer } from '@react-pdf/renderer';
import ModeloCarrefour from '../modelsPdf/modeloCarrefour.js';
//import ModeloNestle from '../modelsPdf/modeloNestle.js';
import ModeloJbs from '../modelsPdf/modeloJbs.js';
import ModeloHiper from '../modelsPdf/modeloHiper.js'
import ModeloDuracell from '../modelsPdf/modeloDuracell.js'

class MenuApp extends React.Component {
  state = {}

  handleItemClick = (e, { name }) => this.props.onClickMenu(name)

  render() {
    const { activeItem } = this.state

    return (
      <Menu compact icon='labeled' style={{marginBottom: 15}}>
        <Menu.Item
          name='coligadas'
          active={activeItem === 'coligadas'}
          onClick={this.handleItemClick}
        >
          <Icon name='building' />
          Coligadas
        </Menu.Item>

        <Menu.Item
          name='empresas'
          active={activeItem === 'empresas'}
          onClick={this.handleItemClick}
        >
          <Icon name='building' />
          Empresas
        </Menu.Item>

        <Menu.Item
          name='colaborador'
          active={activeItem === 'colaborador'}
          onClick={this.handleItemClick}
        >
          <Icon name='user' />
          Colaborador
        </Menu.Item>

        <Menu.Item
          name='cartas'
          active={activeItem === 'cartas'}
          onClick={this.handleItemClick}
        >
          <Icon name='file pdf' />
          Gerar Cartas
        </Menu.Item>
      </Menu>
    )
  }
}

class Home extends React.Component {
  state = {
    menuOpenIs: 'cartas',
    ColigadaPdf: null,
    EmpresaPdf: null,
    LojaPdf: null,
    ColaboradorPdf: null,
    ModeloPdf: null,
    PeriodoInicioPdf: null,
    PeriodoFimPdf: null,
    CargoPdf: null,
    EmissaoPdf: null,


    isOkModelo1: false,
    isOkModelo3: false,
    isOkModelo4: false,
    isOkModelo5: false


  }

  onAttParamsPdf = (name, value) => {
    this.setState({[name]: value});

    if(this.state.ColigadaPdf && this.state.ColaboradorPdf && this.state.EmissaoPdf && this.state.EmpresaPdf){
      this.setState({isOkModelo1: true});
      if(this.state.CargoPdf){
        this.setState({isOkModelo3: true, isOkModelo4: true});
        if(this.state.PeriodoInicioPdf && this.state.PeriodoFimPdf)
          this.setState({isOkModelo5: true})
        else
          this.setState({isOkModelo5: false})
      }else{
        this.setState({isOkModelo3: false, isOkModelo4: false});
      }
    }else{
      this.setState({isOkModelo1: false});
    }
  }

  onClickMenu = (clicked) => {
    this.setState({menuOpenIs: clicked});
    if(clicked !== 'cartas')
      this.setState({
          ColigadaPdf: null,
          EmpresaPdf: null,
          LojaPdf: null,
          ColaboradorPdf: null,
          ModeloPdf: null,
          PeriodoInicioPdf: null,
          PeriodoFimPdf: null,
          CargoPdf: null,
          EmissaoPdf: null,
          isOkModelo1: false,
          isOkModelo3: false,
          isOkModelo4: false,
          isOkModelo5: false
      })
  }

  resetPdfs = () => this.setState({
    //  ColigadaPdf: null,
    //  EmpresaPdf: null,
      LojaPdf: null,
      ColaboradorPdf: null,
      ModeloPdf: null,
      PeriodoInicioPdf: null,
      PeriodoFimPdf: null,
      CargoPdf: null,
      EmissaoPdf: null,
      isOkModelo1: false,
      isOkModelo3: false,
      isOkModelo4: false,
      isOkModelo5: false
  })

  render () {
    return(
      <Container fluid>
        <div style={{width: '50%', float: 'left'}}>
          <MenuApp onClickMenu={this.onClickMenu} />
          { this.state.menuOpenIs === 'coligadas' ?
            <FormColigadas /> : null
          }

          { this.state.menuOpenIs === 'empresas' ?
            <FormEmpresas /> : null
          }

          { this.state.menuOpenIs === 'colaborador' ?
            <FormColaborador style={{marginTop: 15}} /> : null
          }

          { this.state.menuOpenIs === 'cartas' ?
            <FormCartas
              onAttParamsPdf={this.onAttParamsPdf}
              resetPdfs={this.resetPdfs}
              isOkModelo1={this.state.isOkModelo1}
              isOkModelo3={this.state.isOkModelo3}
              isOkModelo4={this.state.isOkModelo4}
              isOkModelo5={this.state.isOkModelo5}
            /> : null
          }
        </div>

            { this.state.ModeloPdf === 'Modelo1' && this.state.menuOpenIs === 'cartas' ?
                <PDFViewer width="48%" height="850px" style={{margin: '0% 0% 5% 2%'}}>
                  <ModeloJbs
                  colaborador={this.state.ColaboradorPdf}
                  coligada={this.state.ColigadaPdf}
                  empresa={this.state.EmpresaPdf}
                  emissao={this.state.EmissaoPdf}
                />
              </PDFViewer> : null
            }

            { this.state.ModeloPdf === 'Modelo3' ?
              <PDFViewer width="48%" height="850px" style={{margin: '0% 0% 5% 2%'}}>
                <ModeloCarrefour
                  colaborador={this.state.ColaboradorPdf}
                  coligada={this.state.ColigadaPdf}
                  empresa={this.state.EmpresaPdf}
                  emissao={this.state.EmissaoPdf}
                  cargo={this.state.CargoPdf}
                  loja={this.state.LojaPdf}
                />
              </PDFViewer> : null
            }

            { this.state.ModeloPdf === 'Modelo4' ?
              <PDFViewer width="48%" height="850px" style={{margin: '0% 0% 5% 2%'}}>
                <ModeloHiper
                  colaborador={this.state.ColaboradorPdf}
                  coligada={this.state.ColigadaPdf}
                  empresa={this.state.EmpresaPdf}
                  emissao={this.state.EmissaoPdf}
                  cargo={this.state.CargoPdf}
                />
              </PDFViewer> : null
            }

            { this.state.ModeloPdf === 'Modelo5' ?
              <PDFViewer width="48%" height="850px" style={{margin: '0% 0% 5% 2%'}}>
                <ModeloDuracell
                  colaborador={this.state.ColaboradorPdf}
                  coligada={this.state.ColigadaPdf}
                  empresa={this.state.EmpresaPdf}
                  emissao={this.state.EmissaoPdf}
                  cargo={this.state.CargoPdf}
                  periodioinicio={this.state.PeriodoInicioPdf}
                  periodofim={this.state.PeriodoFimPdf}
                />
              </PDFViewer> : null
            }

      </Container>
    );
  }
}

export default Home;
