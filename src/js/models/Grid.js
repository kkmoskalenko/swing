class Grid {
    /**
     * Создаёт координатную плоскость
     * @param size Размер ячейки
     * @param gridColor Цвет линий сетки
     * @param guideColor Цвет направляющей
     */
    constructor(size, gridColor, guideColor) {
        this.size = size;
        this.gridColor = gridColor;
        this.guideColor = guideColor;
    }

    /**
     * Рисует вертикальную направляющую по центру холста
     * @param context Контекст 2D рендеринга для элемента canvas
     */
    drawGuide(context) {
        const canvas = context.canvas;

        context.strokeStyle = this.guideColor;
        context.setLineDash([5]);

        context.beginPath();
        context.moveTo(canvas.width / 2, 0);
        context.lineTo(canvas.width / 2, canvas.height);
        context.stroke();

        // Отключает пунктирные линии после отрисовки направляющей
        context.setLineDash([]);
    }

    /**
     * Рисует координатную плоскость в заданном контексте
     * @param context Контекст 2D рендеринга для элемента canvas
     */
    draw(context) {
        const canvas = context.canvas;

        // Number of vertical & horizontal grid lines
        const numLinesX = Math.floor(canvas.height / this.size);
        const numLinesY = Math.floor(canvas.width / this.size);

        context.strokeStyle = this.gridColor;

        // Draw grid lines along X-axis
        for (let i = 0; i <= numLinesX; i++) {
            context.beginPath();
            context.lineWidth = 1;

            if (i === numLinesX) {
                context.moveTo(0, this.size * i);
                context.lineTo(canvas.width, this.size * i);
            }
            else {
                context.moveTo(0, this.size * i + 0.5);
                context.lineTo(canvas.width, this.size * i + 0.5);
            }
            context.stroke();
        }


        // Draw grid lines along Y-axis
        for (let i = 0; i <= numLinesY; i++) {
            context.beginPath();
            context.lineWidth = 1;

            if (i === numLinesY) {
                context.moveTo(this.size * i, 0);
                context.lineTo(this.size * i, canvas.height);
            }
            else {
                context.moveTo(this.size * i + 0.5, 0);
                context.lineTo(this.size * i + 0.5, canvas.height);
            }
            context.stroke();
        }

        this.drawGuide(context);
    }
}

export default Grid;