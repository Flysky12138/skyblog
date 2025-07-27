import React from 'react'

import packageJson from '@/../package.json'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { TableBody, TableCaption, TableCell, TableHead, TableHeader, TablePrimitive, TableRow } from '@/components/table'

export default async function Page() {
  const data = [
    { dataSource: await getPackagesInfo(packageJson.dependencies), name: 'dependencies' },
    { dataSource: await getPackagesInfo(packageJson.devDependencies), name: 'devDependencies' }
  ]

  return (
    <div>
      {data.map(({ dataSource, name }) => (
        <React.Fragment key={name}>
          <TableCaption className="mt-6 mb-3 text-lg first:mt-0">{name}</TableCaption>
          <TablePrimitive className="table-auto">
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>name</TableHead>
                <TableHead>version</TableHead>
                <TableHead>description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataSource.map(({ name, pkg }, index) => (
                <TableRow key={name}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <DisplayByConditional condition={!!pkg.homepage} fallback={name}>
                      <a className="text-link-foreground whitespace-nowrap" href={pkg.homepage} rel="noreferrer nofollow" target="_blank">
                        {name}
                      </a>
                    </DisplayByConditional>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{pkg.version}</TableCell>
                  <TableCell className="whitespace-nowrap">{pkg.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TablePrimitive>
        </React.Fragment>
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
