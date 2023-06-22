'use cache'

import { makeBadge } from 'badge-maker'
import { cacheLife } from 'next/cache'

import packageJson from '@/../package.json'

export default async function Page() {
  cacheLife('max')

  const dataSource = [
    { label: 'dependencies', value: await getPackagesInfo(packageJson.dependencies) },
    { label: 'devDependencies', value: await getPackagesInfo(packageJson.devDependencies) }
  ]

  return (
    <div className="flex flex-col gap-(--py)">
      {dataSource.map(item => (
        <div key={item.label} className="space-y-3">
          <h2
            dangerouslySetInnerHTML={{
              __html: makeBadge({
                label: item.label,
                message: item.value.length.toString(),
                style: 'social'
              })
            }}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: item.value
                .map(({ name, pkg, version }) =>
                  makeBadge({
                    color: 'blue',
                    label: name,
                    message: version,
                    style: 'flat-square',
                    ...(pkg.homepage
                      ? {
                          links: [pkg.homepage]
                        }
                      : {})
                  })
                )
                .join('')
            }}
            className="flex flex-wrap gap-2.5"
          />
        </div>
      ))}
    </div>
  )
}

const getPackagesInfo = async (json: Record<string, string>) => {
  return Promise.all(
    Object.entries(json).map(async ([name, version]) => {
      const pkg = await import(`node_modules/${name}/package.json`)
      return { name, pkg, version }
    })
  )
}
