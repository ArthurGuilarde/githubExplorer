import React, { useState, FormEvent, useEffect } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import { Title, Form, Repositories, Error } from './styles'
import { Link } from 'react-router-dom'

import api from '../../services/api'
import logo from '../../assets/logo.svg'

interface Repository {
  full_name: string
  description: string
  owner: {
    login: string
    avatar_url: string
  }
}

const Dashboard: React.FC = () => {
  const [input, setInput] = useState('')
  const [inputError, setInputError] = useState('')
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const repos = localStorage.getItem('@Githubrepos:repositories')

    if (repos) {
      return JSON.parse(repos)
    }

    return []
  })

  useEffect(
    () =>
      localStorage.setItem(
        '@Githubrepos:repositories',
        JSON.stringify(repositories)
      ),
    [repositories]
  )

  async function hangleAddRepository(event: FormEvent): Promise<void> {
    event.preventDefault()

    if (!input) {
      setInputError('Informe Autor/Repositorio!')
      return
    }

    await api
      .get<Repository>(`repos/${input}`)
      .then((res) => {
        const repository = res.data
        setRepositories([...repositories, repository])
        setInput('')
        setInputError('')
      })
      .catch(() => {
        setInputError('Repositorio invalido!')
        setInput('')
      })
  }

  return (
    <>
      <img src={logo} alt={`Missing ${logo}`} />

      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={hangleAddRepository}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite aqui"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((repo) => (
          <>
            <Link to={`/repository/${repo.full_name}`} key={repo.full_name}>
              <img src={repo.owner.avatar_url} alt={repo.owner.login} />

              <div>
                <strong>{repo.full_name}</strong>
                <p>{repo.description}</p>
              </div>

              <FiChevronRight size={20} />
            </Link>
          </>
        ))}
      </Repositories>
    </>
  )
}

export default Dashboard
