/**
 * Created by kunaldawn on 24/6/17.
 */

/**
 *
 */
class HiddenSurface extends Surface {
    /**
     *
     * @param gl
     * @param width
     * @param height
     */
    constructor(gl, width, height) {
        super();
        this.gl = gl;

        this.hiddenSurface = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.hiddenSurface);
        this.hiddenSurface.width = width;
        this.hiddenSurface.height = height;

        this.framebuffer_texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.framebuffer_texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.hiddenSurface.width, this.hiddenSurface.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

        this.render_buffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.render_buffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.hiddenSurface.width, this.hiddenSurface.height);

        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.framebuffer_texture, 0);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.render_buffer);

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    /**
     *
     */
    unbind() {
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    /**
     *
     */
    bind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.hiddenSurface);
    }

    /**
     *
     * @returns {WebGLTexture|*}
     */
    getTexture() {
        return this.framebuffer_texture;
    }
}