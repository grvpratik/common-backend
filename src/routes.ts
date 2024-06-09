import { Router } from 'express'
import path from 'path'
import fs from 'fs'

export default class Routes {
    // Private property to hold the Express Router instance
    private router: Router

    constructor() {
        // Initialize the router
        this.router = Router()
        // Call the method to initialize routes
        this.initRoutes()
    }

    private initRoutes() {
        // Construct the path to the 'routes' directory relative to the current directory (__dirname)
        const routePath = path.join(__dirname, 'routes')
        // Load routes from the specified path
        this.loadRoutes(routePath)
    }

    private loadRoutes(routePath) {
        // Read all items (files and directories) in the specified path
        const items = fs.readdirSync(routePath)

        // Iterate over each item in the directory
        items.forEach((item) => {
            // Construct the full path for the item
            const itemPath = path.join(routePath, item)
            // Get the file system stats for the item
            const stats = fs.statSync(itemPath)

            // If the item is a directory, recursively load routes from it
            if (stats.isDirectory()) {
                this.loadRoutes(itemPath)
            } else if (stats.isFile()) {
                // If the item is a file with a .js or .ts extension
                if (item.endsWith('.js') || item.endsWith('.ts')) {
                    // If the file name starts with 'root' (case insensitive), mount it at the root path ('/')
                    if (item.toLowerCase().startsWith('root')) {
                        this.router.use('/', require(itemPath).default)
                        return
                    }

                    // Remove the file extension to get the module path
                    const modulePath = itemPath.replace(/\.[A-z]{1,2}/gm, '')
                    // Require the module and get its default export
                    const routeModule = require(modulePath).default
                    // Compute the relative path for mounting the route
                    const mountPath = path
                        .relative(path.join(__dirname, 'routes'), modulePath)
                        .replace(/\\/g, '/') // Convert backslashes to forward slashes
                        .toLowerCase() // Convert the path to lowercase

                    // Use the computed mount path to mount the route module on the router
                    this.router.use(`/${mountPath}`, routeModule)
                }
            }
        })
    }

    // Method to return the router instance
    public getRouter() {
        return this.router
    }
}
