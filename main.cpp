#include <iostream>
#include <vector>

int main()
{
	std::vector<int> test = { 1, 2, 3,4 };
	for(int val : test) {
		std::cout << val << std::endl;
	}
	return 0;
}
