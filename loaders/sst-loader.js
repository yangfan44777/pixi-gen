/**
 * 加载spritesheet.json文件
 */
module.exports = function (source) {
    const callback = this.async();
    source = JSON.parse(source);
    this.loadModule('./' + source.meta.image, (err, _source, sourceMap, module) => {
        source.meta.image = './' + _source.match(/"(.*)"/)[1];
        this.emitFile('./spritesheet.json', JSON.stringify(source));
        callback(null, '{"url": "./spritesheet.json"}');
    });
    return;
}