import {
  Linha,
  Coluna,
  Item,
  Ícone,
  Texto,
  Grade,
  solicite_escolha,
} from "./caju-aplicativo.js"

export class Comando extends Linha {
  constructor(globais, nome) {
    super(0, 0, 2)
    this.globais = globais
    this.nome = nome
    this.objeto = obtenha(globais, nome)
    this.cor_do_tipo = cor_do_tipo(this.objeto)
    this.e.tabIndex = 0
    this.menu = this.adicione(new Linha(0, 0, 2))
    this.menu.e.style.position = "relative"
    this.menu.e.style.width = "0px"
    this.menu.e.style.top = "-68px"
    this.menu.e.style.marginRight = "-2px"
    this.deletar = this.menu.adicione(new Item(this.cor_do_tipo))
    this.deletar.adicione(new Ícone("delete"))
    this.deletar.selecione()
    this.deletar.ao_clicar(() => {
      this.pai.remova(this)
    })
    this.menu.esconda()
    this.item_nome = this.adicione(new Item(this.cor_do_tipo))
    if (this.objeto.aparência) {
      this.objeto.aparência(this)
    } else {
      this.item_nome.adicione(new Texto(nome))
    }
    this.argumentos = []
    this.grade_argumentos = this.adicione(new Grade(0, 0, 0, 2))
    this.grade_argumentos.e.style.columnGap = "2px"
    if (this.objeto.argumentos) {
      for (var i = 0; i< this.objeto.argumentos.length; i++) {
        var argumento = {}
        this.argumentos.push(argumento)
        argumento.linha = this.grade_argumentos.adicione(new Linha(0, 0, 2))
        argumento.definir = argumento.linha.adicione(new Item(cor_do_tipo({
          retorna: this.objeto.argumentos[i][0]
        })))
        argumento.definir.adicione(new Ícone("chevron-left-circle-outline"))
        argumento.definir.selecione()
        argumento.definir.esconda()
        argumento.definir.ao_clicar(function (argumento, retorna) {
          var possibilidades
          if (retorna == "tipo") {
            possibilidades = Object.entries(globais).filter(([nome, valor]) => valor.retorna == "texto").map(([nome, valor]) => [cor_do_tipo(valor), nome, nome])
          } else if (retorna == "nome") {
            possibilidades = Object.entries(globais).filter(([nome, valor]) => valor.retorna == "texto").map(([nome, valor]) => [cor_do_tipo(valor), nome, nome])
          } else if (retorna == "valor") {
            possibilidades = Object.entries(globais).filter(([nome, valor]) => valor.retorna != "nada").map(([nome, valor]) => [cor_do_tipo(valor), nome, nome])
          } else {
            possibilidades = Object.entries(globais).filter(([nome, valor]) => valor.retorna == retorna).map(([nome, valor]) => [cor_do_tipo(valor), nome, nome])
          }
          solicite_escolha(possibilidades, nome => {
            argumento.valor = argumento.linha.adicione(new Comando(globais, nome))
          })
        }.bind(this, argumento, this.objeto.argumentos[i][0]))
      }
    }
    this.e.addEventListener("focus", function () {
      this.selecione()
    }.bind(this))
    this.e.addEventListener("blur", function () {
      this.desselecione()
    }.bind(this))
  }
  selecione() {
    this.menu.mostre()
    this.item_nome.selecione()
    this.argumentos.map(argumento => {
      argumento.definir.mostre()
    })
  }
  desselecione() {
    this.menu.esconda()
    this.item_nome.desselecione()
    this.argumentos.map(argumento => {
      argumento.definir.esconda()
    })
  }
  estruture() {
    if (this.objeto.estruture) {
      return this.objeto.estruture(this)
    }
    return [this.nome, ...this.argumentos.map(argumento => argumento.valor.estruture())]
  }
}

export class BlocoDeComandos extends Coluna {
  constructor(globais, nome) {
    super(0, 0, 2)
    this.nome = nome
    this.cor_do_tipo = cor_do_tipo(obtenha(globais, nome))
    this.e.style.alignItems = "flex-start"
    this.e.tabIndex = 0
    this.blocos = []
    var bloco
    this.blocos.push(bloco = this.adicione(new Comando(globais, nome)))
    bloco.remova(bloco.menu)
    bloco.e.removeAttribute("tabIndex")
    bloco.linha = this.adicione(new Linha(0, 0, 2))
    bloco.indentação = bloco.linha.adicione(new Item(this.cor_do_tipo, 3, 0, 8))
    bloco.indentação.margem_superior = -5
    bloco.indentação.margem_inferior = -5
    bloco.indentação.espessura_da_borda_superior = 0
    bloco.indentação.espessura_da_borda_inferior = 0
    bloco.indentação.camada = 1
    bloco.coluna = bloco.linha.adicione(new Coluna(0, 0, 2))
    bloco.coluna.e.style.alignItems = "flex-start"
    bloco.adicionar = bloco.coluna.adicione(new Item(this.cor_do_tipo))
    bloco.adicionar.esconda()
    bloco.adicionar.selecione()
    bloco.adicionar.adicione(new Ícone("plus-circle-outline"))
    bloco.comandos = []
    bloco.adicionar.ao_clicar(() => {
      var possibilidades = []
      if (globais[this.nome].locais) {
        possibilidades = [...possibilidades, ...Object.entries(globais[this.nome].locais).filter(([nome, valor]) => (valor.mutável == undefined || valor.mutável == true) && valor.retorna == "nada").map(([nome, valor]) => [cor_do_tipo(valor), this.nome + "." + nome, this.nome + "." + nome])]
      }
      possibilidades = [...possibilidades, ...Object.entries(globais).filter(([nome, valor]) => (valor.mutável == undefined || valor.mutável == true) && valor.retorna == "nada").map(([nome, valor]) => [cor_do_tipo(valor), nome, nome])]
      solicite_escolha(possibilidades, nome => {
        var objeto = obtenha(globais, nome)
        if (objeto.tipo == "comando") {
          bloco.comandos.push(bloco.coluna.adicione(new Comando(globais, nome)))
        }
        if (objeto.tipo == "bloco") {
          bloco.comandos.push(bloco.coluna.adicione(new BlocoDeComandos(globais, nome)))
        }
        bloco.coluna.e.appendChild(bloco.adicionar.e)
      })
    })
    this.fim = this.adicione(new Item(this.cor_do_tipo, 3, 0, 8))
    this.fim.largura = 64
    this.e.addEventListener("focus", function () {
      this.selecione()
    }.bind(this))
    this.e.addEventListener("blur", function () {
      this.desselecione()
    }.bind(this))
  }
  selecione() {
    this.blocos.map(bloco => {
      bloco.selecione()
      bloco.indentação.selecione()
      bloco.adicionar.mostre()
    })
    this.fim.selecione()
  }
  desselecione() {
    this.blocos.map(bloco => {
      bloco.desselecione()
      bloco.indentação.desselecione()
      bloco.adicionar.esconda()
    })
    this.fim.desselecione()
  }
  estruture() {
    return [this.nome, ...this.blocos.map(bloco =>
      bloco.comandos.map(comando => comando.estruture())
    )]
  }
}

var cor_do_tipo = (tipo) => {
  if (tipo.blocos) {
    return "#d7ab32"
  }
  if (tipo.argumentos) {
    for (var i = 0; i < tipo.argumentos.length; i++) {
      if (tipo.argumentos[i][0] == "nome") {
        return "#ed6d25"
      }
    }
  }
  return {
    "nada": "#97669a",
    "lógico": "#77b940",
    "número": "#3687c7",
    "texto": "#d53571",
    "lista": "#07b7e0",
    "objeto": "#330b9f",
    "cor": "#909090",
    "nome": "#ed6d25",
    "tipo": "#ed6d25",
    "valor": "#ed6d25",
  }[tipo.retorna]
}

export var obtenha = (globais, nome) => {
  var nomes = nome.split(".")
  var objeto = globais[nomes[0]]
  for (var i = 1; i < nomes.length; i++) {
    objeto = objeto.locais[nomes[i]]
  }
  return objeto
}