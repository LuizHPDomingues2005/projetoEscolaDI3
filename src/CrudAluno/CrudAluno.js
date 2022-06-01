import React, { Component } from 'react';
import axios from 'axios';
import './CrudAluno.css';
import Main from '../components/template/Main';

const title = "Cadastro de Alunos";


const urlAPI = "http://localhost:5001/api/aluno";
const initialState = {
    aluno: { idAluno: 0, ra: '', nomeAluno: '', codCurso: 0 },
    lista: []
}



export default class CrudAluno extends Component {

    state = { ...initialState }

    componentDidMount() {
        axios(urlAPI).then(resp => {
            this.setState({ lista: resp.data })
        })
    }

    limpar() {
        this.setState({ aluno: initialState.aluno });
    }
    salvar() {
        const aluno = this.state.aluno;
        aluno.codCurso = Number(aluno.codCurso);
        const metodo = aluno.idAluno ? 'put' : 'post';
        const url = aluno.idAluno ? `${urlAPI}/${aluno.idAluno}` : urlAPI;

        axios[metodo](url, aluno)
            .then(resp => {
                const lista = this.getListaAtualizada(resp.data)
                this.setState({ aluno: initialState.aluno, lista })
            })
    }
    getListaAtualizada(aluno, excluir = false) {
        const lista = this.state.lista.filter(a => a.idAluno !== aluno.idAluno);
        if(!excluir) lista.unshift(aluno);
        return lista;
    }
    atualizaCampo(event) {
        //clonar usuário a partir do state, para não alterar o state diretamente
        const aluno = { ...this.state.aluno };
        //usar o atributo NAME do input identificar o campo a ser atualizado
        aluno[event.target.name] = event.target.value;
        //atualizar o state
        this.setState({ aluno });
    }
    carregar(aluno) {
        this.setState({ aluno })
    }
    remover(aluno) {
        const url = urlAPI + "/" + aluno.idAluno;
        if (window.confirm("Confirma remoção do aluno: " + aluno.ra)) {
            console.log("entrou no confirm");
            axios['delete'](url, aluno)
                .then(resp => {
                    const lista = this.getListaAtualizada(aluno, true)
                    this.setState({ aluno: initialState.aluno, lista })
                })
        }
    }


    renderForm() {
        return (
            <div className="inclui-container">
                <label> RA: </label>
                <input
                    type="text"
                    id="ra"
                    placeholder="RA do aluno"
                    className="form-input"
                    name="ra"

                    value={this.state.aluno.ra}

                    onChange={e => this.atualizaCampo(e)}
                />
                <label> Nome: </label>
                <input
                    type="text"
                    id="nome"
                    placeholder="Nome do aluno"
                    className="form-input"
                    name="nomeAluno"

                    value={this.state.aluno.nomeAluno}

                    onChange={e => this.atualizaCampo(e)}
                />
                <label> Código do Curso: </label>
                <input
                    type="number"
                    id="codCurso"
                    placeholder="0"
                    className="form-input"
                    name="codCurso"

                    value={this.state.aluno.codCurso}
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
                <table className="listaAlunos" id="tblListaAlunos">
                    <thead>
                        <tr className="cabecTabela">
                            <th className="tabTituloRa">Ra</th>
                            <th className="tabTituloNome">Nome</th>
                            <th className="tabTituloCurso">Curso</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.lista.map(
                            (aluno) =>

                                <tr key={aluno.id}>
                                    <td>{aluno.ra}</td>
                                    <td>{aluno.nomeAluno}</td>
                                    <td>{aluno.codCurso}</td>
                                    <td>
                                        <button onClick={() => this.carregar(aluno)}>
                                            Alterar
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => this.remover(aluno)}>
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