import { dependencies, devDependencies } from '@/../package.json'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { TableBody, TableCaption, TableCell, TableHead, TableHeader, TablePrimitive, TableRow } from '@/components/table'
import React from 'react'

export default async function Page() {
  const data = [
    {
      dataSource: await Promise.all(
        Object.entries(dependencies).map(async ([name, version]) => {
          const pkg = await import(`node_modules/${name}/package.json`)
          return { name, pkg, version }
        })
      ),
      name: 'dependencies'
    },
    {
      dataSource: await Promise.all(
        Object.entries(devDependencies).map(async ([name, version]) => {
          const pkg = await import(`node_modules/${name}/package.json`)
          return { name, pkg, version }
        })
      ),
      name: 'devDependencies'
    }
  ]

  return (
    <section>
      {data.map(({ dataSource, name }) => (
        <React.Fragment key={name}>
          <TableCaption className="mt-6 mb-3 text-lg first:mt-0">{name}</TableCaption>
          <TablePrimitive>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead className="w-60">name</TableHead>
                <TableHead className="w-28">version</TableHead>
                <TableHead>description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataSource.map(({ name, pkg }, index) => (
                <TableRow key={name}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <DisplayByConditional condition={!!pkg.homepage} fallback={name}>
                      <a className="text-link-foreground" href={pkg.homepage} rel="noreferrer nofollow" target="_blank">
                        {name}
                      </a>
                    </DisplayByConditional>
                  </TableCell>
                  <TableCell>{pkg.version}</TableCell>
                  <TableCell>{pkg.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TablePrimitive>
        </React.Fragment>
      ))}
    </section>
  )
}
