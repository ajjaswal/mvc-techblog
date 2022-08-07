const { TestScheduler } = require("jest");
const { format_date, format_plural, format_url } = require('../utils/helpers');

// Test for the format date handlebars helper
test('format_date() returns a date string', () => {
    const date = new Date('2020-03-20 16:12:03');
  
    expect(format_date(date)).toBe('3/20/2020');
  });

// Test for pluralizing words
test('point and comment are properly pluralized when there is more than one vote or comment', () => {
    const plural = 'tiger';
    const singular = 'lion'

    expect(format_plural(plural, 2)).toBe('tigers');
    expect(format_plural(singular, 1)).toBe('lion');
})

// Test for shortening URLs for display
test('format_url() returns a simplified url string', () => {
    const url1 = format_url('http://test.com/page/1');
    const url2 = format_url('https://www.coolstuff.com/abcdefg/');
    const url3 = format_url('https://www.google.com?q=hello');

    expect(url1).toBe('test.com');
    expect(url2).toBe('coolstuff.com');
    expect(url3).toBe('google.com');  
})