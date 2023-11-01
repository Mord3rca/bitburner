import {getRoute} from 'lib/network.js'

export async function main(ns) {
    ns.tprint(await getRoute(ns, ns.args[0]))
}
