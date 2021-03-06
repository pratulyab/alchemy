/**
 *
 *   mm   ""#           #
 *   ##     #     mmm   # mm    mmm   mmmmm  m   m
 *  #  #    #    #"  "  #"  #  #"  #  # # #  "m m"
 *  #mm#    #    #      #   #  #""""  # # #   #m#
 * #    #   "mm  "#mm"  #   #  "#mm"  # # #   "#
 *                                            m"
 *                                           ""
 * Author : Kunal Dawn (kunal@bobblekeyboard.com)
 */

/**
 * This class manages shader pipeline for a filter.
 */
class Shader {
     /**
     * Creates a shader with given vertex and fragment shader
     * @param gl openGL context
     * @param vertexSource Vertex shader source
     * @param fragmentSource Fragment shader source
     */
    constructor(gl, vertexSource, fragmentSource) {
        this.gl = gl;
        this.program = this.gl.createProgram();

        this.gl.attachShader(this.program, this.compileSource(this.gl.VERTEX_SHADER, vertexSource));
        this.gl.attachShader(this.program, this.compileSource(this.gl.FRAGMENT_SHADER, fragmentSource));
        this.gl.linkProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            throw 'link error: ' + this.gl.getProgramInfoLog(this.program);
        }

        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER,
            new Float32Array(
                [-1, -1, 0, 0,
                 -1,  1, 0, 1,
                  1, -1, 1, 0,
                  1,  1, 1, 1]
            ), this.gl.STATIC_DRAW);

        this.gl.useProgram(this.program);
        this.vertexAttribute = gl.getAttribLocation(this.program, 'position');
    }

    /**
     * Compile vertex or fragment shader source
     *
     * @param type Type of the shader
     * @param source Source for the shader
     * @returns {WebGLShader} Shader program
     */
    compileSource(type, source) {
        let shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw 'compile error: ' + this.gl.getShaderInfoLog(shader);
        }
        return shader;
    }

    /**
     *  Destroy shader program
     */
    destroy() {
        this.gl.deleteProgram(this.program);
        this.program = null;
    }

    /**
     * Set uniform value defined in the shader
     *
     * @param name Name of the uniform
     * @param value Value of the uniform
     */
    setUniform(name, value) {
        this.gl.useProgram(this.program);
        let location = this.gl.getUniformLocation(this.program, name);
        if (location === null) {
            return;
        }

        if (Array.isArray(value)) {
            switch (value.length) {
                case 1:
                    this.gl.uniform1fv(location, new Float32Array(value));
                    break;
                case 2:
                    this.gl.uniform2fv(location, new Float32Array(value));
                    break;
                case 3:
                    this.gl.uniform3fv(location, new Float32Array(value));
                    break;
                case 4:
                    this.gl.uniform4fv(location, new Float32Array(value));
                    break;
                case 9:
                    this.gl.uniformMatrix3fv(location, false, new Float32Array(value));
                    break;
                case 16:
                    this.gl.uniformMatrix4fv(location, false, new Float32Array(value));
                    break;
                default:
                    throw 'dont know how to load uniform "' + name + '" of length ' + value.length;
            }
        } else if (Number.isInteger(value)) {
            this.gl.uniform1i(location, value);
        } else {
            this.gl.uniform1f(location, value);
        }
    }

    /**
     * Render the shader to a surface
     *
     * @params surface Visible or Hidden surface
     * @params textures List of textures that needs to be attached to the shader
     */
    render(surface, textures) {
        // Bind surface
        surface.bind();
        this.gl.viewport(0, 0, surface.getWidth(), surface.getHeight());

        // Bind textures
        for (let unit in textures) {
            textures[unit].use(unit);
        }

        // Use shader and render
        this.gl.enableVertexAttribArray(this.vertexAttribute);
        this.gl.useProgram(this.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(this.vertexAttribute, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        // Unbind textures
        for (let unit in textures) {
            textures[unit].unuse(unit);
        }

        // Unbind surface
        surface.unbind();
    }
}