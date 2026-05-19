'use cache'

import { makeBadge } from 'badge-maker'
import { cacheLife } from 'next/cache'

import packageJson from '~/package.json'

import { getPackageInfo } from './utils'

export default async function Page() {
  cacheLife('max')

  const dataSource = [
    { label: 'dependencies', pkgs: Object.entries(packageJson.dependencies).map(getPackageInfo) },
    { label: 'devDependencies', pkgs: Object.entries(packageJson.devDependencies).map(getPackageInfo) }
  ]

  return (
    <div className="flex flex-col gap-(--py)">
      {dataSource.map(({ label, pkgs }) => (
        <div key={label} className="space-y-3">
          <h2
            dangerouslySetInnerHTML={{
              __html: makeBadge({
                label,
                message: pkgs.length.toString(),
                style: 'social'
              })
            }}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: pkgs
                .map(({ homepage, name, version }) =>
                  makeBadge({
                    color: 'blue',
                    label: name,
                    message: version,
                    style: 'flat-square',
                    ...(homepage
                      ? {
                          links: [homepage]
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
