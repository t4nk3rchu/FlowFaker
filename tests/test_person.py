import unittest
from faker import Faker
from src import person

class TestPerson(unittest.TestCase):
    def setUp(self):
        self.fake_default = Faker('en_US')
        self.fake_vi = Faker('vi_VN')

    def test_first_name_random_gender(self):
        name = person.firstName(self.fake_default, {})
        self.assertIsInstance(name, str)
        self.assertTrue(len(name.strip()) > 0)

    def test_ordered_name_default_locale(self):
        opts = {"_ordered_tokens": ["last", "first"]}
        out = person.orderedName(self.fake_default, opts)
        self.assertIsInstance(out, str)
        self.assertIn(" ", out)

    def test_ordered_name_with_lang(self):
        opts = {"_ordered_tokens": ["last", "middle", "first"], "lang": "vi_VN"}
        out = person.orderedName(self.fake_default, opts)
        self.assertIsInstance(out, str)
        self.assertTrue(len(out.split()) >= 2)

    def test_ordered_name_invalid_lang_fallback(self):
        opts = {"_ordered_tokens": ["last", "first"], "lang": "bad_lang"}
        out = person.orderedName(self.fake_default, opts)
        self.assertIsInstance(out, str)
        self.assertIn(" ", out)

if __name__ == '__main__':
    unittest.main()