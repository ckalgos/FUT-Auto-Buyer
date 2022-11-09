import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Userscript's all headers.
 */
interface UserScriptOptions {
    'require-template': string;
    name: string;
    namespace: string;
    description: string;
    version: string;
    author: string;
    homepage: string;
    homepageURL: string;
    website: string;
    source: string;
    icon: string;
    iconURL: string;
    defaulticon: string;
    icon64: string;
    icon64URL: string;
    updateURL: string;
    downloadURL: string;
    supportURL: string;
    include: string[];
    match: string[];
    exclude: string[];
    require: string[];
    resources: string[];
    connect: string[];
    'run-at': string;
    grant: string[];
    antifeature: string[];
    noframes: boolean;
    nocompat: string;
}

/**
 * Brief interface of the main structure of "package.json".
 */
interface PackageJsonOptions {
    name: string;
    version: string;
    description: string;
    author: string;
    homepage: string;
    userscript: Partial<UserScriptOptions>;
    dependencies: { [key: string]: string };
}

/**
 * Generate a userscript's headers from "package.json" file.
 * 
 * @returns {string} Return userscript's header.
 */
export function generateHeader() {

    const packageJsonRaw = readFileSync(join(__dirname, '../package.json'), 'utf8');
    const packageJson = JSON.parse(packageJsonRaw) as Partial<PackageJsonOptions>;
    const userscript = packageJson.userscript as Partial<UserScriptOptions>;

    // The regular expression used to remove the dependency version string prefix.
    const dependencyVersionRegExp = /^[\^~]/;
    // Userscript's header.
    const headers = ['// ==UserScript=='];

    /**
     * Add userscript header's name. 
     * If the name is not set, the package name is used. If neither is set, an error is thrown.
     */
    if (packageJson.name || userscript.name) {
        headers.push(`// @name ${userscript.name ?? packageJson.name}`);
    } else {
        throw new Error('No name specified in package.json');
    }
    /**
     * Add userscript header's version. 
     * If the version is not set, the package version is used. If neither is set, an error is thrown.
     */
    if (packageJson.version || userscript.version) {
        headers.push(`// @version ${userscript.version ?? packageJson.version}`);
    } else {
        throw new Error('No version specified in package.json');
    }
    // Add userscript header's namespace.
    if (userscript.namespace) {
        headers.push(`// @namespace ${userscript.namespace}`);
    }
    // Add userscript header's description.
    if (packageJson.description || userscript.description) {
        headers.push(`// @description ${userscript.description ?? packageJson.description}`);
    }
    // Add userscript header's author.
    if (packageJson.author || userscript.author) {
        headers.push(`// @author ${userscript.author ?? packageJson.author}`);
    }
    // Add userscript header's homepage, homepageURL, website or source.
    if (packageJson.homepage || userscript.homepage) {
        headers.push(`// @homepage ${userscript.homepage ?? packageJson['homepage']}`);
    } else if (userscript.homepageURL) {
        headers.push(`// @homepageURL ${userscript.homepageURL}`);
    } else if (userscript.website) {
        headers.push(`// @website ${userscript.website}`);
    } else if (userscript.source) {
        headers.push(`// @source ${userscript.source}`);
    }
    // Add userscript header's icon, iconURL or defaulticon.
    if (userscript.icon) {
        headers.push(`// @icon ${userscript.icon}`);
    } else if (userscript.iconURL) {
        headers.push(`// @iconURL ${userscript.iconURL}`);
    } else if (userscript.defaulticon) {
        headers.push(`// @defaulticon ${userscript.defaulticon}`);
    }
    // Add userscript header's icon64 or icon64URL.
    if (userscript.icon64) {
        headers.push(`// @icon64 ${userscript.icon64}`);
    } else if (userscript.icon64URL) {
        headers.push(`// @icon64URL ${userscript.icon64URL}`);
    }
    // Add userscript header's updateURL.
    if (userscript.updateURL) {
        headers.push(`// @updateURL ${userscript.updateURL}`);
    }
    // Add userscript header's downloadURL.
    if (userscript.downloadURL) {
        headers.push(`// @downloadURL ${userscript.downloadURL}`);
    }
    // Add userscript header's supportURL.
    if (userscript.supportURL) {
        headers.push(`// @supportURL ${userscript.supportURL}`);
    }
    // Add userscript header's includes.
    if (userscript.include && userscript.include instanceof Array) {
        for (const include of userscript.include) {
            headers.push(`// @include ${include}`);
        }
    }
    // Add userscript header's matches.
    if (userscript.match && userscript.match instanceof Array) {
        for (const match of userscript.match) {
            headers.push(`// @match ${match}`);
        }
    }
    // Add userscript header's excludes.
    if (userscript.exclude && userscript.exclude instanceof Array) {
        for (const exclude of userscript.exclude) {
            headers.push(`// @exclude ${exclude}`);
        }
    }
    /**
     * Add userscript header's requires.
     * The package name and version will be obtained from the "dependencies" field, 
     * and the jsdelivr link will be generated automatically.
     * You can also set the string template with the parameters "{dependencyName}" and "{dependencyVersion}" 
     * in the "require-template" field of the "userscript" object in the "package.json" file.
     */
    if (packageJson.dependencies) {
        const urlTemplate = userscript['require-template'] ?? 'https://cdn.jsdelivr.net/npm/{dependencyName}@{dependencyVersion}';
        const requireTemplate = `// @require ${urlTemplate}`;
        for (const dependencyName in packageJson.dependencies) {
            const dependencyVersion = packageJson.dependencies[dependencyName].replace(dependencyVersionRegExp, '');
            headers.push(
                requireTemplate
                    .replace('{dependencyName}', dependencyName)
                    .replace('{dependencyVersion}', dependencyVersion)
            );
        }
    }
    // You can also add dependencies separately in the require field of the userscript object.
    if (userscript.require && userscript.require instanceof Array) {
        for (const require of userscript.require) {
            headers.push(`// @require ${require}`);
        }
    }
    // Add userscript header's resources.
    if (userscript.resources && userscript.resources instanceof Array) {
        for (const resource of userscript.resources) {
            headers.push(`// @resource ${resource}`);
        }
    }
    // Add userscript header's connects.
    if (userscript.connect && userscript.connect instanceof Array) {
        for (const connect of userscript.connect) {
            headers.push(`// @connect ${connect}`);
        }
    }
    // Add userscript header's run-at.
    if (userscript['run-at']) {
        headers.push(`// @run-at ${userscript['run-at']}`);
    }
    // Add userscript header's grants.
    if (userscript.grant && userscript.grant instanceof Array) {
        for (const grant of userscript.grant) {
            headers.push(`// @grant ${grant}`);
        }
    }
    // Add userscript header's antifeatures.
    if (userscript.antifeature && userscript.antifeature instanceof Array) {
        for (const antifeature of userscript.antifeature) {
            headers.push(`// @antifeature ${antifeature}`);
        }
    }
    // Add userscript header's noframes.
    if (userscript.noframes) {
        headers.push('// @noframes');
    }
    // Add userscript header's nocompat.
    if (userscript.nocompat) {
        headers.push(`// @nocompat ${userscript.nocompat}`);
    }
    // Userscript header's ending.
    headers.push('// ==/UserScript==\n')
    return headers.join('\n');
}