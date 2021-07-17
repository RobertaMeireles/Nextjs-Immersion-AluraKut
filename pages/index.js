import React from 'react'
import nookies from 'nookies'; // lib para criar o cookie
import jwt from 'jsonwebtoken'; // lib para decodificar o token
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper} from '../src/components/ProfileRelations';


// função para a sidebar
function ProfileSidebar(props) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

// COmponente que lista os seguidores
function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
      <ul>
        {props.items.map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={itemAtual.avatar_url}>
                <img src={itemAtual.avatar_url} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}


export default function Home(props) {

  // variaveis
  const usuarioAleatorio = props.githubUser;
  const [comunidades, setComunidades] = React.useState([]);

  const pessoasFavoritas = [
    'hugofolly',
    'ludivinepoussier',
    'karennasserdev',
    'jfcpcosta',
    'gustavoguanabara',
    'MarAzevedoRocha'
  ]

  const [seguidores, setSeguidores] = React.useState([]);
  console.log('seguidores:', seguidores);
  

  // GET Seguidores github (useEffect)
  React.useEffect(function() {
    fetch(`https://api.github.com/users/${props.githubUser}/followers`)
    .then(function (respostaDoServidor) {
      return respostaDoServidor.json();
    })
    .then(function(respostaCompleta) {
      setSeguidores(respostaCompleta);
    })


    // API GraphQL para cadastrar comunidade através do formulário
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '12c8f97ed5996938ea99eb17f2aadb',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "query": `query {
        allCommunities {
          id 
          title
          imageUrl
          creatorSlug
        }
      }` })
    })
    .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      console.log(comunidadesVindasDoDato)
      setComunidades(comunidadesVindasDoDato)
    })
    // .then(function (response) {
    //   return response.json()
    // })
  }, [])


  return (
      <>
        <AlurakutMenu />

        {/* Bem-Vindo */}
        <MainGrid>
          <div className="profileArea" style={{ gridArea: 'profileArea' }}>
            <ProfileSidebar githubUser={usuarioAleatorio} />
          </div>
          <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
            <Box>
              <h1 className="title">
                Bem-vindo(a) 
              </h1>
  
              <OrkutNostalgicIconSet />
            </Box>
  
            {/* formulário cadastrar comunidades */}
            <Box>
              <h2 className="subTitle">O que você deseja fazer?</h2>
              <form onSubmit={function handleCriaComunidade(e) {
                  e.preventDefault();
                  const dadosDoForm = new FormData(e.target);
  
                  console.log('Campo: ', dadosDoForm.get('title'));
                  console.log('Campo: ', dadosDoForm.get('image'));
  
                  const comunidade = {
                    title: dadosDoForm.get('title'),
                    imageUrl: dadosDoForm.get('image'),
                    creatorSlug: usuarioAleatorio,
                  }
                  fetch('/api/comunidades', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(comunidade)
                  })
                  .then(async (response) => {
                    const dados = await response.json();
                    console.log(dados.registroCriado);
                    const comunidade = dados.registroCriado;
                    const comunidadesAtualizadas = [...comunidades, comunidade];
                    setComunidades(comunidadesAtualizadas)
                  })
              }}>
                <div>
                  <input
                    placeholder="Qual vai ser o nome da sua comunidade?"
                    name="title"
                    aria-label="Qual vai ser o nome da sua comunidade?"
                    type="text"
                    />
                </div>
                <div>
                  <input
                    placeholder="Coloque uma URL para usarmos de capa"
                    name="image"
                    aria-label="Coloque uma URL para usarmos de capa"
                  />
                </div>
  
                <button>
                  Criar comunidade
                </button>
              </form>
            </Box>
          </div>

          {/* Listar comunidades cadastradas */}
          <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
            <ProfileRelationsBoxWrapper>
              <h2 className="smallTitle">
                Comunidades ({comunidades.length})
              </h2>
              <ul>
                {comunidades.map((itemAtual) => {
                  return (
                    <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                    <img src={itemAtual.imageUrl} />
                        <span>{itemAtual.title}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </ProfileRelationsBoxWrapper>

            {/* Listar pessoas da comunidade */}
            <ProfileRelationsBoxWrapper>
              <h2 className="smallTitle">
                Pessoas da comunidade ({pessoasFavoritas.length})
              </h2>
              <ul>
                {pessoasFavoritas.map((itemAtual) => {
                  return (
                    <li key={itemAtual}>
                      <a href={`/users/${itemAtual}`}>
                        <img src={`https://github.com/${itemAtual}.png`} />
                        <span>{itemAtual}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </ProfileRelationsBoxWrapper>

            {/* Listar seguidores */}
            <ProfileRelationsBox title="Seguidores" items={seguidores}></ProfileRelationsBox>
          </div>
        </MainGrid>
      </>
    )
  }

  
// informações do servidor que estão sendo enviadas para a página home (pages/login populou o cookie
//utilizando a lib nookies).
export async function getServerSideProps(context) {
  const cookies = nookies.get(context) 
  const token = cookies.USER_TOKEN; // pegar do cookie o token
  // 
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
        Authorization: token
      }
  })
  .then((resposta) => resposta.json())

  // redirect do next para caso a pessoa não esteja autenticado, não exista no cadastro da api
  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token); // decodificar o token usando a lib jwt
  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
} 