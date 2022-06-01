import React, { Component } from 'react';
import axios from 'axios';
import './CrudCurso.css';
import Main from '../components/template/Main';

const title = "Cadastro de Cursos";

const urlAPI = "http://localhost:5001/api/curso";
const initialState = {
    curso: { idCurso: 0,  codigo: 0, nomeCurso: '' },
    lista: []
}

export default class CrudCurso extends Component {

    state = { ...initialState }

    componentDidMount() {
        axios(urlAPI).then(resp => {
            this.setState({ lista: resp.data })
        })
    }

    limpar() {
        this.setState({ curso: initialState.curso });
    }
    salvar() {
        const curso = this.state.curso;
        curso.codigo = Number(curso.codigo);
        const metodo = curso.idCurso ? 'put' : 'post';
        const url = curso.idCurso ? `${urlAPI}/${curso.idCurso}` : urlAPI;

        axios[metodo](url, curso)
            .then(resp => {
                const lista = this.getListaAtualizada(resp.data)
                this.setState({ curso: initialState.curso, lista })
            })
    }
    getListaAtualizada(curso, excluir = false) {
        const lista = this.state.lista.filter(c => c.idCurso !== curso.idCurso);
        if(!excluir) lista.unshift(curso);
        return lista;
    }
    atualizaCampo(event) {
        //clonar usuário a partir do state, para não alterar o state diretamente
        const curso = { ...this.state.curso };
        //usar o atributo NAME do input identificar o campo a ser atualizado
        curso[event.target.name] = event.target.value;
        //atualizar o state
        this.setState({ curso });
    }
    carregar(curso) {
        this.setState({ curso })
    }
    remover(curso) {
        const url = urlAPI + "/" + curso.idCurso;
        if (window.confirm("Confirma remoção do curso: " + curso.codigo)) {
            console.log("entrou no confirm");
            axios['delete'](url, curso)
                .then(resp => {
                    const lista = this.getListaAtualizada(curso, true)
                    this.setState({ curso: initialState.curso, lista })
                })
        }
    }


    renderForm() {
        return (
            <div className="inclui-container">
                <label> Código do Curso: </label>
                <input
                    type="number"
                    id="codCurso"
                    placeholder="0"
                    className="form-input"
                    name="codigo"

                    value={this.state.curso.codigo}
                    onChange={e => this.atualizaCampo(e)}
                />
                <label> Nome: </label>
                <input
                    type="text"
                    id="nome"
                    placeholder="Nome do curso"
                    className="form-input"
                    name="nomeCurso"

                    value={this.state.curso.nomeCurso}

                    onChange={e => this.atualizaCampo(e)}
                />
                
                <button className="btnSalvar"
                    onClick={e => this.salvar(e)} >
                    Salvar
                </button>
                <button className="btnCancelar"
                    onClick={e => this.limpar(e)} >
                    Cancelar
                </button>
            </div>
        )
    }

    renderTable() {
        return (
            <div className="listagem">
                <table className="listaCursos" id="tblListaCursos">
                    <thead>
                        <tr className="cabecTabela">
                            <th className="tabTituloCurso">Código Curso</th>
                            <th className="tabTituloNome">Nome</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.lista.map(
                            (curso) =>

                                <tr key={curso.id}>
                                    <td>{curso.codigo}</td>
                                    <td>{curso.nomeCurso}</td>
                                    <td>
                                        <button onClick={() => this.carregar(curso)}>
                                            Alterar
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => this.remover(curso)}>
                                            Remover
                                        </button>
                                    </td>
                                </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
    render() {
        return (
            <Main title={title}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}