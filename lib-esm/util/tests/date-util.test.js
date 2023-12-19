import { dateUtil } from '../date-util';
describe('date-util', () => {
    describe('toYyyyMmDd', () => {
        it('should return yyyy-mm-dd format', () => {
            expect(dateUtil.toYyyyMmDd(new Date(2021, 0, 1))).toBe('2021-01-01');
            expect(dateUtil.toYyyyMmDd(new Date(2021, 11, 31))).toBe('2021-12-31');
            expect(dateUtil.toYyyyMmDd(new Date(2021, 10, 11))).toBe('2021-11-11');
        });
        it('should return empty string if date is not defined', () => {
            const result = dateUtil.toYyyyMmDd(undefined);
            expect(result).toBe('');
        });
    });
});
//# sourceMappingURL=date-util.test.js.map