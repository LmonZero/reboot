const { join } = require('path')
const tools = require('../lib/tools')
const tempCodeCfg = require('./loading_js/config')
const util = require('util')
class loading {
    constructor() {
        //目前只干加载code配置 后续增加定时任务
        this.scriptInfo = {
            cmdTable: {},
            cmdClass: []
        }
    }
    init() {
        for (let scriptInfo of tempCodeCfg.scriptInfo) {
            try {
                let cmdClass = { key: 'p', name: '未知' }
                if (scriptInfo.group) {
                    let cmdClassArr = scriptInfo.group.split("-")
                    cmdClass.key = cmdClassArr[0] ? cmdClassArr[0] : cmdClass.key
                    cmdClass.name = cmdClassArr[1] ? cmdClassArr[1] : cmdClass.name
                }
                this.scriptInfo.cmdClass.push(cmdClass)

                this.scriptInfo.cmdTable[cmdClass.key] = {}

                if (scriptInfo.name && scriptInfo.mian) {
                    this.scriptInfo.cmdTable[cmdClass.key][scriptInfo.name] = {
                        mian: scriptInfo.mian,
                        description: scriptInfo.description
                    }
                }

            } catch (error) {
                tools.error('error->', error, '\r\n', scriptInfo)
            }
        }
    }

    async run(info) {
        let res = null
        try {
            let main = this.getScript(info.cmd, info.param[0])
            if (main) {
                if (util.types.isAsyncFunction(main)) {
                    res = await main(...info.param.slice(1))
                } else {
                    res = main(...info.param.slice(1))
                }
            } else {
                tools.debug("没脚本？？？")
            }
        } catch (error) {
            tools.error('run error->', error)
        }
        return res
    }


    getScript(group, name) {
        let funcMain = null
        try {
            funcMain = this.scriptInfo.cmdTable[group][name]["mian"]
            // tools.debug('error->', filePath)
            // funcMain = require(filePath)
            // delete require(require.resolve(filePath))
        } catch (error) {
            tools.error(`${group}-${name}`, 'getScript error->', error)
        }
        return funcMain
    }

}

module.exports = loading