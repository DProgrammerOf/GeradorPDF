import React from 'react'
import { PDFViewer } from '@react-pdf/renderer';
import ModeloCarrefour from '../modelsPdf/modeloCarrefour.js';
import ModeloNestle from '../modelsPdf/modeloNestle.js';
import ModeloJbs from '../modelsPdf/modeloJbs.js';
import ModeloHiper from '../modelsPdf/modeloHiper.js'


const ModeloView = ({ModeloPdf, ColaboradorPdf, ColigadaPdf, Emissao, EmpresaPdf}) => (
  <PDFViewer width="48%" height="850px" style={{margin: '5% 0% 5% 2%'}}>
    { this.props.ModeloPdf === 'Modelo1' ?
      <ModeloJbs
        colaborador={this.props.ColaboradorPdf}
        coligada={this.props.ColigadaPdf}
        empresa={this.props.EmpresaPdf}
        emissao={this.props.EmissaoPdf}
      /> : null
    }

    { this.props.ModeloPdf === 'Modelo2' ?
      <ModeloNestle
        colaborador={this.props.ColaboradorPdf}
        coligada={this.props.ColigadaPdf}
        empresa={this.props.EmpresaPdf}
        emissao={this.props.EmissaoPdf}
      /> : null
    }

    { this.props.ModeloPdf === 'Modelo3' ?
      <ModeloCarrefour
        colaborador={this.props.ColaboradorPdf}
        coligada={this.props.ColigadaPdf}
        empresa={this.props.EmpresaPdf}
        emissao={this.props.EmissaoPdf}
        cargo={this.props.CargoPdf}
      /> : null
    }

    { this.props.ModeloPdf === 'Modelo4' ?
      <ModeloHiper
        colaborador={this.props.ColaboradorPdf}
        coligada={this.props.ColigadaPdf}
        empresa={this.props.EmpresaPdf}
        emissao={this.props.EmissaoPdf}
        cargo={this.props.CargoPdf}
      /> : null
    }
  </PDFViewer>
);

export default ModeloView;
