import {
  Linha,
  Coluna,
  Item,
  Ícone,
  Texto as CajuTexto,
  CampoDeTexto,
  Grade,
  solicite_escolha,
} from "./caju-aplicativo.js"

export class Comando extends Linha {
  constructor(cor, nome, argumentos) {
    super(0, 0, 2)
    this.nome = nome
    this.e.tabIndex = 0
    this.menu = this.adicione(new Linha(0, 0, 2))
    this.menu.e.style.position = "relative"
    this.menu.e.style.width = "0px"
    this.menu.e.style.top = "-68px"
    this.menu.e.style.marginRight = "-2px"
    this.deletar = this.menu.adicione(new Item(cor))
    this.deletar.adicione(new Ícone("delete"))
    this.deletar.selecione()
    this.deletar.ao_clicar(() => {
      this.pai.remova(this)
    })
    this.menu.esconda()
    this.item_nome = this.adicione(new Item(cor))
    this.identifique_se()
    this.argumentos = []
    this.grade_argumentos = this.adicione(new Grade(0, 0, 0, 2))
    this.grade_argumentos.e.style.columnGap = "2px"
    if (argumentos) {
      for (var i = 0; i < argumentos.length; i++) {
        var argumento = {}
        this.argumentos.push(argumento)
        argumento.linha = this.grade_argumentos.adicione(new Linha(0, 0, 2))
        argumento.definir = argumento.linha.adicione(new Item(cor))
        argumento.definir.adicione(new Ícone("chevron-left-circle-outline"))
        argumento.definir.selecione()
        argumento.definir.esconda()
        argumento.definir.ao_clicar(this.defina_argumento.bind(this, argumento))
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
  defina_argumento(argumento, retorna) {
    var possibilidades = []
    possibilidades = this.escopo.map(Tipo => [Tipo.cor, Tipo.nome, Tipo])
    solicite_escolha(possibilidades, Tipo => {
      argumento.valor = argumento.linha.adicione(new Tipo())
    })
  }
  identifique_se() {
    this.item_nome.adicione(new CajuTexto(this.nome))
  }
}

export class BlocoDeComandos extends Coluna {
  constructor() {
    super(0, 0, 2)
    this.e.style.alignItems = "flex-start"
    this.e.tabIndex = 0
    this.blocos = []
    var bloco
    this.blocos.push(bloco = this.adicione(new Comando(this.constructor.cor, this.constructor.name)))
    bloco.remova(bloco.menu)
    bloco.e.removeAttribute("tabIndex")
    bloco.linha = this.adicione(new Linha(0, 0, 2))
    bloco.indentação = bloco.linha.adicione(new Item(this.constructor.cor, 3, 0, 8))
    bloco.indentação.margem_superior = -5
    bloco.indentação.margem_inferior = -5
    bloco.indentação.espessura_da_borda_superior = 0
    bloco.indentação.espessura_da_borda_inferior = 0
    bloco.indentação.camada = 1
    bloco.coluna = bloco.linha.adicione(new Coluna(0, 0, 2))
    bloco.coluna.e.style.alignItems = "flex-start"
    bloco.adicionar = bloco.coluna.adicione(new Item(this.constructor.cor))
    bloco.adicionar.esconda()
    bloco.adicionar.selecione()
    bloco.adicionar.adicione(new Ícone("plus-circle-outline"))
    bloco.comandos = []
    bloco.adicionar.ao_clicar(this.adicione_comando.bind(this, bloco))
    this.fim = this.adicione(new Item(this.constructor.cor, 3, 0, 8))
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
  adicione_comando(bloco) {
    var possibilidades = []
    possibilidades = this.escopo.map(Tipo => [Tipo.cor, Tipo.name, Tipo])
    solicite_escolha(possibilidades, Tipo => {
      bloco.comandos.push(bloco.coluna.adicione(new Tipo()))
      bloco.coluna.e.appendChild(bloco.adicionar.e)
    })
  }
  avalie(globais) {
    this.blocos.map(bloco => {
      bloco.comandos.map(comando => {
        comando.avalie(globais)
      })
    })
  }
}

export class Aplicativo extends BlocoDeComandos {
  static cor = "#d7ab32"
  constructor() {
    super()
    this.escopo = [
      Texto,
      CampoDeNúmero,
    ]
  }
  avalie(globais) {
    globais["caju.componentes"] = new Set([
      "Coluna",
    ])
    globais["caju.cabeçalho"] = [
      "<body></body>",
      "<script type=\"module\">",
    ]
    globais["caju.corpo"] = [
      "var aplicativo = new Coluna();",
      "aplicativo.largura = \"100%\";",
    ]
    globais["caju.rodapé"] = [
      "document.body.appendChild(aplicativo.e);",
      "</script>",
    ]
    super.avalie(globais)
    globais["caju.cabeçalho"].push("import { " + [...globais["caju.componentes"]].join(",") + " } from \"https://cajueiro.herokuapp.com/angelonuffer/caju/0.0.0/caju-aplicativo.js\";")
    globais["caju.saída"] += globais["caju.cabeçalho"].join("")
    globais["caju.saída"] += globais["caju.corpo"].join("")
    globais["caju.saída"] += globais["caju.rodapé"].join("")
  }
}

export class Texto extends Comando {
  static cor = "#97669a"
  constructor() {
    super(Texto.cor, "Texto", ["valor"])
    this.escopo = [
      TipoTexto,
    ]
  }
  avalie(globais) {
    globais["caju.componentes"].add("Texto")
    globais["caju.corpo"].push("aplicativo.adicione(new Texto(" + this.argumentos[0].valor.avalie(globais) + ", 24, \"#000000\"));")
  }
}

export class CampoDeNúmero extends Comando {
  static cor = "#97669a"
  constructor() {
    super(Texto.cor, "CampoDeNúmero", ["nome"])
    this.escopo = [
      TipoTexto,
    ]
  }
  avalie(globais) {
    globais["caju.componentes"].add("CampoDeNúmero")
    globais["caju.corpo"].push("aplicativo.adicione(new CampoDeNúmero());")
  }
}

export class TipoTexto extends Comando {
  static cor = "#d53571"
  static nome = "\"\""
  constructor() {
    super(TipoTexto.cor)
  }
  identifique_se() {
    this.item_nome.adicione(new CajuTexto("\""))
    this.valor = this.item_nome.adicione(new CampoDeTexto())
    this.item_nome.adicione(new CajuTexto("\""))
  }
  avalie(globais) {
    return "\"" + this.valor.e.textContent + "\""
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
